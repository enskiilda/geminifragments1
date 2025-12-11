import { Message } from '@/lib/messages'
import { FragmentSchema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import { LoaderIcon } from 'lucide-react'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import AgentMode from './agent-mode'
import LoaderSpinner from './loader-spinner'
import { Typewriter } from './typewriter'

export function Chat({
  messages,
  isLoading,
  setCurrentPreview,
  onOpenMobilePreview,
}: {
  messages: Message[]
  isLoading: boolean
  setCurrentPreview: (preview: {
    fragment: DeepPartial<FragmentSchema> | undefined
    result: ExecutionResult | undefined
  }) => void
  onOpenMobilePreview: () => void
}) {
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [JSON.stringify(messages)])

  return (
    <div
      id="chat-container"
      className="flex flex-col pb-12 gap-4 overflow-y-auto max-h-full"
    >
      {messages.map((message: Message, index: number) => (
        <div key={index} className="text-sm">
          {message.role === 'user' ? (
            <div className="flex justify-end">
              <div>
                <div className="ml-4 rounded-[16px] px-4 py-2 md:ml-24 bg-[#ededed] dark:bg-[#2b2b2b] text-stone-900 dark:text-white font-medium">
                  <div>
                    <div>
                      {message.content.map((content, id) => {
                        if (content.type === 'text') {
                          return (
                            <ReactMarkdown key={id}>
                              {content.text}
                            </ReactMarkdown>
                          )
                        }
                        if (content.type === 'image') {
                          return (
                            <img
                              key={id}
                              src={content.image}
                              alt="attachment"
                              className="mt-2 max-w-full rounded-lg"
                            />
                          )
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex">
                <div className="mr-4 md:mr-24 text-black dark:text-white font-medium">
                  <div>
                    {message.content.map((content, id) => {
                      if (content.type === 'text') {
                        const isLastMessage = index === messages.length - 1
                        const shouldAnimate = isLoading && isLastMessage
                        return (
                          <div key={id}>
                            {shouldAnimate ? (
                              <Typewriter text={content.text} speed={10} />
                            ) : (
                              <ReactMarkdown>{content.text}</ReactMarkdown>
                            )}
                          </div>
                        )
                      }
                      if (content.type === 'image') {
                        return (
                          <img
                            key={id}
                            src={content.image}
                            alt="attachment"
                            className="mt-2 max-w-full rounded-lg"
                          />
                        )
                      }
                    })}
                  </div>
                  {message.object && (
                    <div
                      onClick={() => {
                        setCurrentPreview({
                          fragment: message.object,
                          result: message.result,
                        })
                        onOpenMobilePreview()
                      }}
                      className="mt-2 py-2 pl-2 w-full md:w-max flex items-center border rounded-xl select-none hover:bg-gray-50 dark:hover:bg-white/10 hover:cursor-pointer"
                    >
                      <div className="rounded-[0.5rem] w-10 h-10 bg-black/5 dark:bg-white/5 self-stretch flex items-center justify-center">
                        {isLoading && index === messages.length - 1 ? (
                          <LoaderSpinner
                            width={24}
                            height={24}
                            trackActiveColor="currentColor"
                            trackColor="var(--alpha-15, rgba(0,0,0,0.15))"
                          />
                        ) : (
                          <AgentMode width={24} height={24} />
                        )}
                      </div>
                      <div className="pl-2 pr-4 flex flex-col">
                        <span className="font-bold font-sans text-sm text-primary">
                          {message.object.title}
                        </span>
                        <span className="font-sans text-sm text-muted-foreground">
                          Click to see fragment
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {isLoading && messages.length === 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <LoaderIcon strokeWidth={2} className="animate-spin w-4 h-4" />
          <span>Generating...</span>
        </div>
      )}
    </div>
  )
}
