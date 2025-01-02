import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Message {
  id: string
  chat_id: string
  user_email: string
  content: any
  role: "user" | "assistant"
  created_at: string
}

export function useMessages(currentChatId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const fetchMessages = useCallback(async () => {
    if (!currentChatId || !session?.user?.email) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/messages/${currentChatId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [currentChatId, session?.user?.email])

  // Fetch messages when chat ID changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages()
    } else {
      setMessages([]) // Clear messages when no chat is selected
    }
  }, [currentChatId, fetchMessages])

  const addMessage = async (content: any) => {
    if (!currentChatId || !session?.user?.email) return

    try {
      // Add user message
      const userResponse = await fetch(`/api/messages/${currentChatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: { type: "text", text: content },
          role: "user" 
        }),
      })

      if (!userResponse.ok) {
        throw new Error("Failed to add user message")
      }

      const userMessage = await userResponse.json()
      setMessages((prev) => [...prev, userMessage])

      // Get AI response
      const aiResponseData = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: content })
      }).then(res => res.json())

      // Add AI message
      const aiResponse = await fetch(`/api/messages/${currentChatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: aiResponseData.response,
          role: "assistant"
        }),
      })

      if (aiResponse.ok) {
        const aiMessage = await aiResponse.json()
        setMessages((prev) => [...prev, aiMessage])
      }

      return userMessage
    } catch (error) {
      console.error("Error adding message:", error)
      toast.error("Failed to add message")
      return null
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    refreshMessages: fetchMessages,
  }
}
