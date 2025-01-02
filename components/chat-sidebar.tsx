"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

interface Chat {
  id: string
  title: string
  created_at: string
  user_email: string
}

interface ChatSidebarProps {
  chats: Chat[]
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  currentChatId?: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ChatSidebar({
  chats,
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  currentChatId,
  searchQuery,
  onSearchChange
}: ChatSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      {/* Blur Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[199] bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[200] w-[300px] bg-muted/50 backdrop-blur-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h2 className="font-semibold">Your Chats</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onNewChat}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Chat
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent",
                    currentChatId === chat.id && "bg-accent"
                  )}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(chat.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
