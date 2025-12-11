import Logo from './logo'
import { ModelPicker } from './model-picker'
import { TemplatePicker } from './template-picker'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Session } from '@supabase/supabase-js'
import { ArrowRight, LogOut, Trash, Undo } from 'lucide-react'
import Link from 'next/link'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { Templates } from '@/lib/templates'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'

export function NavBar({
  session,
  showLogin,
  signOut,
  onClear,
  canClear,
  onUndo,
  canUndo,
  templates,
  selectedTemplate,
  onSelectedTemplateChange,
  models,
  languageModel,
  onLanguageModelChange,
}: {
  session: Session | null
  showLogin: () => void
  signOut: () => void
  onClear: () => void
  canClear: boolean
  onUndo: () => void
  canUndo: boolean
  templates: Templates
  selectedTemplate: string
  onSelectedTemplateChange: (template: string) => void
  models: LLMModel[]
  languageModel: LLMModelConfig
  onLanguageModelChange: (config: LLMModelConfig) => void
}) {
  return (
    <nav className="w-full flex bg-background py-4">
      <div className="flex flex-1 items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={24} height={24} />
        </Link>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                disabled={!canClear}
              >
                <Trash className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <ThemeToggle />
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {session ? (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'account',
                        label: (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">My Account</span>
                            <span className="text-xs text-gray-400">
                              {session.user.email}
                            </span>
                          </div>
                        ),
                        selectable: false,
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'model',
                        label: (
                          <div>
                            <ModelPicker
                              models={models}
                              languageModel={languageModel}
                              onLanguageModelChange={onLanguageModelChange}
                            />
                          </div>
                        ),
                        selectable: false,
                      },
                      {
                        key: 'template',
                        label: (
                          <div>
                            <TemplatePicker
                              templates={templates}
                              selectedTemplate={selectedTemplate}
                              onSelectedTemplateChange={onSelectedTemplateChange}
                            />
                          </div>
                        ),
                        selectable: false,
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'signout',
                        label: (
                          <div className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </div>
                        ),
                        onClick: signOut,
                      },
                    ] as MenuProps['items'],
                  }}
                  placement="bottomRight"
                  autoAdjustOverflow={false}
                >
                  <div className="cursor-pointer">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          session.user.user_metadata?.avatar_url ||
                          'https://avatar.vercel.sh/' + session.user.email
                        }
                        alt={session.user.email}
                      />
                    </Avatar>
                  </div>
                </Dropdown>
              </TooltipTrigger>
              <TooltipContent>My Account</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button variant="default" onClick={showLogin}>
            Sign in
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  )
}
