"use client"

import { useState, useEffect } from "react"
import { ChatWindow } from "@/components/chat-window"
import { ChatInput } from "@/components/chat-input"
import { toast } from "sonner"
import { AnimatedBackground } from "@/components/animated-background"
import { WelcomeScreen } from "@/components/welcome-screen"
import { Welcome } from "@/components/welcome"
import { cn } from "@/lib/utils"
import { ChatHeader } from "@/components/chat-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings } from "lucide-react"
import { SettingsModal } from "@/components/settings-modal"
import { useSession } from "next-auth/react"
import { useMessageUsage } from "@/hooks/useMessageUsage"

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

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const { data: session } = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { incrementCount } = useMessageUsage()

  const handleSubmit = async (message: string, kana: string) => {
    if (!message.trim()) return;

    setShowWelcome(false);
    setIsLoading(true);
    
    try {
      // Add user message immediately
      const userMessage = { 
        sender: "user", 
        content: { 
          type: "text", 
          text: message 
        } 
      };
      setConversationHistory(prev => [...prev, userMessage]);
      
      // Increment count BEFORE making the API call
      await incrementCount();
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message, 
          kana,
          conversationHistory: conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add assistant's response as a separate message
      const assistantMessage = {
        sender: "assistant",
        content: data.response.content
      };
      
      setConversationHistory(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-background overflow-hidden relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setSettingsOpen(true)}
          className="relative group"
        >
          {session ? (
            <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
              <AvatarImage src={session.user?.image!} />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
              <AvatarFallback>
                <Settings className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-[120px]">
        {showWelcome ? (
          <WelcomeScreen />
        ) : (
          <ChatWindow
            messages={conversationHistory}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            setConversationHistory={setConversationHistory}
          />
        )}
      </div>
    </main>
  );
}