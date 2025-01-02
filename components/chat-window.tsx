"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useChats } from "@/hooks/useChats"
import { useMessages } from "@/hooks/useMessages"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { WelcomeScreen } from "@/components/welcome-screen"
import { SettingsModal } from "@/components/settings-modal"
import { toast } from "sonner"

export function ChatWindow() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string>()
  const { messages, addMessage, clearMessages } = useMessages(currentChatId)
  const { chats, createChat, deleteChat } = useChats()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  const [mode, setMode] = useState("off")
  const { data: session } = useSession()

  const handleCreateChat = async () => {
    try {
      const chat = await createChat("New Chat")
      if (chat) {
        setCurrentChatId(chat.id)
        setShowWelcome(false)
        setIsSidebarOpen(false)
      }
    } catch (error) {
      console.error("Error creating chat:", error)
      toast.error("Failed to create chat")
    }
  }

  const handleSubmit = async (content: string) => {
    if (!currentChatId) {
      // If no chat exists, create one first
      const chat = await createChat("New Chat")
      if (chat) {
        setCurrentChatId(chat.id)
        setShowWelcome(false)
      } else {
        return
      }
    }

    setIsLoading(true)
    try {
      await addMessage({
        content: { type: "text", text: content },
        role: "user",
      })
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId)
    setShowWelcome(false)
    setIsSidebarOpen(false)
  }

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId)
    if (currentChatId === chatId) {
      setCurrentChatId(undefined)
      setShowWelcome(true)
      clearMessages()
    }
  }

  const filteredChats = chats?.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        chats={filteredChats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleCreateChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-1 flex flex-col">
        {showWelcome ? (
          <WelcomeScreen 
            onStart={handleCreateChat} 
            isOpenSettings={isOpenSettings}
            setIsOpenSettings={setIsOpenSettings}
          />
        ) : (
          <>
            <ChatHeader
              onOpenSidebar={() => setIsSidebarOpen(true)}
              currentChatId={currentChatId}
              onOpenSettings={() => setIsOpenSettings(true)}
            />
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-2xl space-y-4">
                {messages.map((message, i) => (
                  <ChatMessage 
                    key={message.id || i} 
                    message={{
                      sender: message.role,
                      content: message.content
                    }}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <span className="loading loading-dots loading-md"></span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t">
              <div className="mx-auto max-w-2xl">
                <ChatInput
                  isLoading={isLoading}
                  currentChatId={currentChatId}
                  onCreateChat={handleCreateChat}
                  onSubmit={handleSubmit}
                  mode={mode}
                  setMode={setMode}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <SettingsModal
        open={isOpenSettings}
        onOpenChange={setIsOpenSettings}
      />
    </div>
  )
}