# Fragments by E2B

## Overview
Fragments is an open-source AI-powered code generation tool (similar to Anthropic's Artifacts). It allows users to generate and execute code using various AI models and sandbox environments.

## Project Structure
- `app/` - Next.js app router pages and API routes
  - `api/chat/` - Chat API endpoint for AI conversations
  - `api/morph-chat/` - Morph chat API endpoint
  - `api/sandbox/` - Sandbox execution API
- `components/` - React UI components
  - `ui/` - Reusable UI primitives (buttons, dialogs, etc.)
- `lib/` - Utility functions and configurations
  - `models.ts` - AI model configurations
  - `templates.ts` - Sandbox templates
- `public/` - Static assets and third-party logos
- `sandbox-templates/` - E2B sandbox template configurations

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI SDK**: Vercel AI SDK
- **Code Execution**: E2B Code Interpreter
- **UI Components**: Radix UI primitives
- **Database**: Supabase (optional, for auth/storage)

## Development
The application runs on port 5000 in development mode.

```bash
npm run dev
```

## Environment Variables
This project may require various API keys depending on which AI providers you want to use:
- `E2B_API_KEY` - For E2B sandbox execution
- `OPENAI_API_KEY` - For OpenAI models
- `ANTHROPIC_API_KEY` - For Claude models
- `GOOGLE_API_KEY` - For Google AI models
- Additional provider keys as needed

## Recent Changes
- Configured for Replit environment (port 5000, allowed hosts for iframe preview)
- Removed X-Frame-Options: DENY to allow Replit preview iframe
