"use client";

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/useSubscription"
import { useMessageUsage } from "@/hooks/useMessageUsage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChatInputProps {
  onSubmit: (value: string) => Promise<boolean | void>
  isLoading?: boolean
  currentChatId?: string
  onCreateChat?: () => Promise<string>
  mode?: string
  setMode?: (mode: string) => void
}

export function ChatInput({
  onSubmit,
  isLoading,
  currentChatId,
  onCreateChat,
  mode = "off",
  setMode = () => {},
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { subscription } = useSubscription()
  const { hasReachedLimit, incrementCount } = useMessageUsage()

  const handleSubmit = async () => {
    if (!input.trim() || hasReachedLimit) return

    const trimmedInput = input.trim()
    setInput("") // Clear input early for better UX
    
    try {
      if (!currentChatId && onCreateChat) {
        const newChatId = await onCreateChat()
        if (!newChatId) {
          console.error('Failed to create new chat')
          setInput(trimmedInput) // Restore input on error
          return
        }
      }

      await incrementCount()
      const result = await onSubmit(trimmedInput)
      if (result === false) {
        setInput(trimmedInput) // Restore input if submission failed
      }
    } catch (error) {
      console.error('Error submitting message:', error)
      setInput(trimmedInput) // Restore input on error
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const characterLimit = subscription?.plan === 'free' ? 250 
    : subscription?.plan === 'pro' ? 70000 
    : subscription?.plan === 'max' ? 70000 
    : 250;

  return (
    <div className={cn(
      "relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-2 py-2 sm:px-4",
      !currentChatId && "sm:rounded-md sm:border sm:px-8"
    )}>
      <div className="relative flex items-center">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasReachedLimit ? "You have hit your limit! Check settings" : "Type a message..."}
          spellCheck={false}
          className={cn(
            "min-h-[40px] w-full resize-none bg-transparent py-[0.8rem] focus-within:outline-none sm:text-sm",
            currentChatId ? "px-2" : "px-4"
          )}
          disabled={isLoading || hasReachedLimit}
          maxLength={characterLimit}
        />
        <div className={cn(
          "absolute right-0 top-[6px]",
          currentChatId ? "sm:right-0" : "sm:right-4"
        )}>
          <div className="flex gap-2">
            {setMode && (
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="hiragana">Hiragana</SelectItem>
                  <SelectItem value="katakana">Katakana</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button 
              type="submit"
              size="icon"
              disabled={isLoading || !input || hasReachedLimit}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}