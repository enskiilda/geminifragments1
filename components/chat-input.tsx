"use client"

import type React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { IconPaperclip, IconPlus, IconSearch, IconSparkles } from "@tabler/icons-react"
import { useRef, useState } from "react"

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ")
}

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
  onFileChange?: (files: File[]) => void
}

export default function ChatInput({ value, onChange, onSubmit, isLoading, onFileChange }: ChatInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (value.trim()) {
      onSubmit(e)
      setIsExpanded(false)

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }

    setIsExpanded(e.target.value.length > 100 || e.target.value.includes("\n"))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
      handleSubmit(formEvent)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileChange) {
      onFileChange(Array.from(e.target.files))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="group/composer w-full">
      <input ref={fileInputRef} type="file" multiple className="sr-only" onChange={handleFileInputChange} />

      <div
        className={cn(
          "w-full max-w-2xl mx-auto bg-transparent dark:bg-muted/50 cursor-text overflow-clip bg-clip-padding p-2.5 shadow-lg border border-border transition-all duration-200",
          isExpanded
            ? "rounded-3xl grid grid-cols-1 grid-rows-[auto_1fr_auto]"
            : "rounded-[28px] grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto]",
        )}
        style={{
          gridTemplateAreas: isExpanded
            ? "'header' 'primary' 'footer'"
            : "'header header header' 'leading primary trailing' '. footer .'",
        }}
      >
        <div
          className={cn(
            "flex min-h-14 items-center overflow-x-hidden px-1.5",
            isExpanded ? "px-2 py-1 mb-0" : "-my-2.5",
          )}
          style={{ gridArea: "primary" }}
        >
          <div className="flex-1 overflow-auto max-h-52">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-0 resize-none rounded-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin dark:bg-transparent"
              rows={1}
            />
          </div>
        </div>

        <div className={cn("flex", isExpanded && "hidden")} style={{ gridArea: "leading" }}>
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 h-9 w-9 rounded-full hover:bg-accent"
              >
                <IconPlus className="size-6 text-muted-foreground" />
              </button>
            </DropdownMenuPrimitive.Trigger>

            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                align="start"
                sideOffset={4}
                className="bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md max-w-xs rounded-2xl p-1.5"
              >
                <DropdownMenuPrimitive.Group className="space-y-1">
                  <DropdownMenuPrimitive.Item
                    className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-[calc(1rem-6px)]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IconPaperclip size={20} className="opacity-60" />
                    Add photos & files
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Item
                    className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-[calc(1rem-6px)]"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-2">
                      <IconSparkles size={20} className="opacity-60" />
                      Agent mode
                    </div>
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Item
                    className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-[calc(1rem-6px)]"
                    onClick={() => {}}
                  >
                    <IconSearch size={20} className="opacity-60" />
                    Deep Research
                  </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Group>
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>
        </div>

        <div className="flex items-center gap-2" style={{ gridArea: isExpanded ? "footer" : "trailing" }}>
          <div className="ms-auto flex items-center gap-1.5">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 size-9 h-9 w-9 rounded-full"
            >
              {isLoading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-square-icon lucide-square"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-icon lucide-arrow-up"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
