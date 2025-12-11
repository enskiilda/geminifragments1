import { z } from 'zod'

// Schema dla pojedynczego kroku agenta
export const agentStepSchema = z.object({
  type: z
    .enum(['thinking', 'searching', 'reading', 'analyzing', 'editing', 'testing', 'decision'])
    .describe('Type of the agent step'),
  content: z
    .string()
    .describe('Content of the step - what the agent is doing or thinking'),
  completed: z
    .boolean()
    .describe('Whether this step is completed'),
})

export type AgentStep = z.infer<typeof agentStepSchema>

// Schema dla pojedynczego pliku w aplikacji
export const fileSchema = z.object({
  file_path: z.string().describe('Relative path to the file, including the file name'),
  file_content: z.string().describe('Content of the file'),
})

export type FileSchema = z.infer<typeof fileSchema>

// Główny schema dla aplikacji full-stack
export const fragmentSchema = z.object({
  // Kroki myślenia agenta - streamowane na żywo
  current_step: z
    .string()
    .describe('MUST BE GENERATED FIRST. Current step the agent is performing. Examples: "Analyzing requirements...", "Deciding on architecture...", "Creating file structure...", "Writing component..."'),
  steps: z
    .array(agentStepSchema)
    .describe('All steps the agent has taken. Each step should be streamed immediately as it happens.'),
  
  // Metadane projektu
  template: z
    .string()
    .describe('Name of the template used to generate the application'),
  title: z.string().describe('Short title of the application. Max 5 words.'),
  description: z
    .string()
    .describe('Description of the full-stack application. 1-2 sentences.'),
  
  // Zależności
  additional_dependencies: z
    .array(z.string())
    .describe('Additional dependencies required by the application'),
  has_additional_dependencies: z
    .boolean()
    .describe('Whether additional dependencies are required'),
  install_dependencies_command: z
    .string()
    .describe('Command to install additional dependencies'),
  
  // Port
  port: z
    .number()
    .nullable()
    .describe('Port number used by the application. Null when no ports are exposed.'),
  
  // Pliki aplikacji - główny punkt wejścia dla kompatybilności wstecznej
  file_path: z
    .string()
    .describe('Main entry file path for the application'),
  code: z
    .string()
    .describe('Main entry file code'),
  
  // Wszystkie pliki aplikacji full-stack
  files: z
    .array(fileSchema)
    .describe('All files of the full-stack application. Generate multiple files for a complete application.'),
})

export type FragmentSchema = z.infer<typeof fragmentSchema>

// Schema for morph edit instructions
export const morphEditSchema = z.object({
  commentary: z
    .string()
    .describe('Explain what changes you are making and why'),
  instruction: z
    .string()
    .describe('One line instruction on what the change is'),
  edit: z
    .string()
    .describe(
      "You should make it clear what the edit is, while also minimizing the unchanged code you write. When writing the edit, you should specify each edit in sequence, with the special comment // ... existing code ... to represent unchanged code in between edited lines. For example: // ... existing code ... FIRST_EDIT // ... existing code ... SECOND_EDIT // ... existing code ... THIRD_EDIT // ... existing code ... Be Lazy when outputting code, rely heavily on the exisitng code comments, but each edit should contain minimally sufficient context of unchanged lines around the code you're editing to resolve ambiguity. DO NOT omit spans of pre-existing code (or comments) without using the // ... existing code ... comment to indicate its absence. If you omit the existing code comment, the model may inadvertently delete these lines. If you plan on deleting a section, you must provide context before and after to delete it. If the initial code is ```code \\n Block 1 \\n Block 2 \\n Block 3 \\n code```, and you want to remove Block 2, you would output ```// ... existing code ... \\n Block 1 \\n  Block 3 \\n // ... existing code ...```. ",
    ),
  file_path: z.string().describe('Path to the file being edited'),
})

export type MorphEditSchema = z.infer<typeof morphEditSchema>
