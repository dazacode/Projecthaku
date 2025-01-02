"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Bot, User } from "lucide-react"
import { Globe, MessageSquare, ScrollText, Lightbulb, Volume2, BookOpen, PenTool } from "lucide-react"
import { Button } from "./ui/button"

interface Message {
  sender: "user" | "assistant"
  content: {
    type: "text" | "structured"
    text?: string
    translation?: {
      japanese: string
      romaji: string
      english: string
    }
    exampleSentences?: Array<{
      japanese: string
      romaji: string
      english: string
    }>
    characterBreakdown?: Array<{
      character: string
      romaji: string
      meaning: string
    }>
    tips?: string[]
  }
}

interface ChatMessageProps {
  message: Message
  userImage?: string
}

export function ChatMessage({ message, userImage }: ChatMessageProps) {
  const isUser = message.sender === "user"

  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-4 px-4 py-6",
        isUser && "flex-row-reverse"
      )}
    >
      {isUser ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={userImage || ""} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10">
          <img
            src="/haku.png"
            alt="H"
            className="h-6 w-6 rounded-full object-cover"
          />
        </div>
      )}

      <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1", isUser && "items-end")}>
        {message.content.type === "text" ? (
          <div className={cn(
            "prose prose-neutral dark:prose-invert max-w-none break-words rounded-2xl px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {message.content.text === "..." ? (
              <div className="flex items-center space-x-1">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/50" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/50 [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/50 [animation-delay:0.4s]" />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content.text || ""}
              </ReactMarkdown>
            )}
          </div>
        ) : (
          <Card className={cn(
            "w-full max-w-2xl space-y-4 p-6",
            isUser && "ml-auto"
          )}>
            {/* Translation section */}
            {message.content.translation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <h3 className="font-medium">Translation</h3>
                </div>
                <div className="grid gap-1">
                  <div className="text-lg font-medium">{message.content.translation.japanese}</div>
                  <div className="text-sm text-muted-foreground">{message.content.translation.romaji}</div>
                  <div className="text-sm">{message.content.translation.english}</div>
                </div>
              </div>
            )}

            {/* Example sentences section */}
            {message.content.exampleSentences && message.content.exampleSentences.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <h3 className="font-medium">Example Sentences</h3>
                </div>
                <div className="grid gap-3">
                  {message.content.exampleSentences.map((example, i) => (
                    <div key={i} className="grid gap-1">
                      <div className="font-medium">{example.japanese}</div>
                      <div className="text-sm text-muted-foreground">{example.romaji}</div>
                      <div className="text-sm">{example.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Character breakdown section */}
            {message.content.characterBreakdown && message.content.characterBreakdown.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  <h3 className="font-medium">Character Breakdown</h3>
                </div>
                <div className="grid gap-2">
                  {message.content.characterBreakdown.map((char, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="px-2 py-1 text-lg">
                        {char.character}
                      </Badge>
                      <div className="grid gap-0.5">
                        <div className="text-sm text-muted-foreground">{char.romaji}</div>
                        <div className="text-sm">{char.meaning}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips section */}
            {message.content.tips && message.content.tips.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <h3 className="font-medium">Tips</h3>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  {message.content.tips.map((tip, i) => (
                    <li key={i} className="text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
