"use client"

import { Button } from "@/components/ui/button"
import { ChatSidebar } from "./chat-sidebar"
import { useState } from "react"
import { useChats } from "@/hooks/useChats"

export function Welcome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { chats, createChat, deleteChat } = useChats()

  const handleNewChat = async () => {
    const chat = await createChat("New Chat")
    if (chat) {
      setIsSidebarOpen(false)
      // You can add navigation logic here
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-1rem)] flex-col items-center justify-center bg-background p-4">
      {/* Haku Logo Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
      >
        <img
          src="/haku.png"
          alt="Haku"
          className="h-10 w-10 rounded-full object-cover"
        />
      </button>

      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex items-center space-x-2">
          <img
            src="/haku.png"
            alt="Haku"
            className="h-12 w-12 rounded-full object-cover"
          />
          <h1 className="text-4xl font-bold">Haku</h1>
        </div>
        <p className="max-w-sm text-lg text-muted-foreground">
          Your Japanese language learning companion. Start a conversation to begin your journey.
        </p>
        <Button size="lg" onClick={handleNewChat}>
          Start Learning
        </Button>
      </div>

      <ChatSidebar
        chats={chats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={() => {
          setIsSidebarOpen(false)
          // Add navigation logic here
        }}
        onDeleteChat={deleteChat}
        searchQuery=""
        onSearchChange={() => {}}
      />
    </div>
  )
}
