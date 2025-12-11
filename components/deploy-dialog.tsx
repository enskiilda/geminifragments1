import Logo from './logo'
import { CopyButton } from './ui/copy-button'
import { publish } from '@/app/actions/publish'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Duration } from '@/lib/duration'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { Dropdown, Select as AntSelect } from 'antd'
import type { MenuProps } from 'antd'

export function DeployDialog({
  url,
  sbxId,
  teamID,
  accessToken,
}: {
  url: string
  sbxId: string
  teamID: string | undefined
  accessToken: string | undefined
}) {
  const posthog = usePostHog()

  const [publishedURL, setPublishedURL] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)

  useEffect(() => {
    setPublishedURL(null)
  }, [url])

  async function publishURL(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { url: publishedURL } = await publish(
      url,
      sbxId,
      duration as Duration,
      teamID,
      accessToken,
    )
    setPublishedURL(publishedURL)
    posthog.capture('publish_url', {
      url: publishedURL,
    })
  }

  const items: MenuProps['items'] = [
    {
      key: 'content',
      label: (
        <div className="p-4 w-80 flex flex-col gap-2">
          <div className="text-sm font-semibold">Deploy to E2B</div>
          <div className="text-sm text-muted-foreground">
            Deploying the fragment will make it publicly accessible to others via
            link.
          </div>
          <div className="text-sm text-muted-foreground">
            The fragment will be available up until the expiration date you choose
            and you&apos;ll be billed based on our{' '}
            <a
              href="https://e2b.dev/docs/pricing"
              target="_blank"
              className="underline"
            >
              Compute pricing
            </a>
            .
          </div>
          <div className="text-sm text-muted-foreground">
            All new accounts receive $100 worth of compute credits. Upgrade to{' '}
            <a
              href="https://e2b.dev/dashboard?tab=billing"
              target="_blank"
              className="underline"
            >
              Pro tier
            </a>{' '}
            for longer expiration.
          </div>
          <form className="flex flex-col gap-2" onSubmit={publishURL}>
            {publishedURL ? (
              <div className="flex items-center gap-2">
                <Input value={publishedURL} readOnly />
                <CopyButton content={publishedURL} />
              </div>
            ) : (
              <AntSelect
                placeholder="Set expiration"
                onChange={(value) => setDuration(value)}
                options={[
                  { label: '30 Minutes', value: '30m' },
                  { label: '1 Hour', value: '1h' },
                  { label: '3 Hours · Pro', value: '3h' },
                  { label: '6 Hours · Pro', value: '6h' },
                  { label: '1 Day · Pro', value: '1d' },
                ]}
              />
            )}
            <Button
              type="submit"
              variant="default"
              disabled={publishedURL !== null}
            >
              {publishedURL ? 'Deployed' : 'Accept and deploy'}
            </Button>
          </form>
        </div>
      ),
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button variant="default">
        <Logo style="e2b" width={16} height={16} className="mr-2" />
        Deploy to E2B
      </Button>
    </Dropdown>
  )
}
