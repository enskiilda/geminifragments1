import { FragmentSchema, FileSchema } from '@/lib/schema'
import { ExecutionResultInterpreter, ExecutionResultWeb } from '@/lib/types'
import { Sandbox } from '@e2b/code-interpreter'
import { API_KEYS } from '@/lib/api-keys'

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const {
      fragment,
      userID,
      teamID,
      accessToken,
    }: {
      fragment: FragmentSchema
      userID: string | undefined
      teamID: string | undefined
      accessToken: string | undefined
    } = await req.json()
    console.log('fragment', fragment)
    console.log('userID', userID)

    // Create an interpreter or a sandbox
    const sbx = await Sandbox.create(fragment.template, {
      apiKey: API_KEYS.E2B,
      metadata: {
        template: fragment.template,
        userID: userID ?? '',
        teamID: teamID ?? '',
      },
      timeoutMs: sandboxTimeout,
      ...(teamID && accessToken
        ? {
            headers: {
              'X-Supabase-Team': teamID,
              'X-Supabase-Token': accessToken,
            },
          }
        : {}),
    })

    // Install packages
    if (fragment.has_additional_dependencies) {
      await sbx.commands.run(fragment.install_dependencies_command)
      console.log(
        `Installed dependencies: ${fragment.additional_dependencies.join(', ')} in sandbox ${sbx.sandboxId}`,
      )
    }

    // Kopiuj wszystkie pliki z tablicy files
    if (fragment.files && Array.isArray(fragment.files) && fragment.files.length > 0) {
      for (const file of fragment.files as FileSchema[]) {
        if (file.file_path && file.file_content) {
          await sbx.files.write(file.file_path, file.file_content)
          console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`)
        }
      }
    }
    
    // Kopiuj główny plik (dla kompatybilności wstecznej)
    if (fragment.code && fragment.file_path) {
      await sbx.files.write(fragment.file_path, fragment.code)
      console.log(`Copied main file to ${fragment.file_path} in ${sbx.sandboxId}`)
    }

    // Execute code or return a URL to the running sandbox
    if (fragment.template === 'code-interpreter-v1') {
      const { logs, error, results } = await sbx.runCode(fragment.code || '')

      return new Response(
        JSON.stringify({
          sbxId: sbx?.sandboxId,
          template: fragment.template,
          stdout: logs.stdout,
          stderr: logs.stderr,
          runtimeError: error,
          cellResults: results,
        } as ExecutionResultInterpreter),
      )
    }

    return new Response(
      JSON.stringify({
        sbxId: sbx?.sandboxId,
        template: fragment.template,
        url: `https://${sbx?.getHost(fragment.port || 80)}`,
      } as ExecutionResultWeb),
    )
  } catch (error: any) {
    console.error('Sandbox error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create sandbox',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
