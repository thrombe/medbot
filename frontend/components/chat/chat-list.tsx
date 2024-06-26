import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MessageType } from '@/lib/message-type'

interface ChatListProps {
  messages:MessageType[];
  completion:string;
  isLoading:boolean;
  loadingSubmit?: boolean;
}

export default function ChatList({
  messages,
  completion,
  isLoading,
  loadingSubmit,
}: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [name, setName] = React.useState<string>('')

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const username = localStorage.getItem('user_name')
    if (username) {
      setName(username)
    }
  }, [])


  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <Image
            src="/ollama.png"
            alt="AI"
            width={60}
            height={60}
            className="h-20 w-14 object-contain dark:invert"
          />
          <p className="text-center text-lg text-muted-foreground">
            How can I help you today?
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="scroller"
      className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
    >
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages.map((message, index) => {
          return (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              className={cn(
                'flex flex-col gap-2 p-4 whitespace-pre-wrap',
                message.role === 'user' ? 'items-end' : 'items-start',
              )}
            >
              <div className="flex gap-3 items-center">
                {message.role === 'user' && (
                  <div className="flex items-end gap-3">
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {message.content}
                    </span>
                    <Avatar className="flex justify-start items-center overflow-hidden">
                      <AvatarImage
                        src="/"
                        alt="user"
                        width={6}
                        height={6}
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {name && name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="flex items-end gap-2">
                    <Avatar className="flex justify-start items-center">
                      <AvatarImage
                        src="/ollama.png"
                        alt="AI"
                        width={6}
                        height={6}
                        className="object-contain dark:invert"
                      />
                    </Avatar>
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {message.content}
                      {isLoading &&
                        messages.indexOf(message) === messages.length - 1 && (
                          <span
                            className="animate-pulse"
                            aria-label="Typing"
                          >
                            ...
                          </span>
                        )}
                    </span>
                  </div>
                )}

              </div>
            </motion.div>
          )

        })}
        {
          isLoading && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                },
              }}
              className={cn(
                'flex flex-col gap-2 p-4 whitespace-pre-wrap',
                'items-start',
              )}
            >
              <div className="flex gap-3 items-center">
              <div className="flex items-end gap-2">
              <Avatar className="flex justify-start items-center">
                <AvatarImage
                  src="/ollama.png"
                  alt="AI"
                  width={6}
                  height={6}
                  className="object-contain dark:invert"
                />
              </Avatar>
              <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                {completion}
                <span
                  className="animate-pulse"
                  aria-label="Typing"
                >
                  ...
                </span>
              </span>
            </div>
              </div>
            </motion.div>
            
          )
        }
        {loadingSubmit && (
          <div className="flex pl-4 pb-4 gap-2 items-center">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/ollama.png"
                alt="AI"
                width={6}
                height={6}
                className="object-contain dark:invert"
              />
            </Avatar>
            <div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        id="anchor"
        ref={bottomRef}
      ></div>
    </div>
  )
}
