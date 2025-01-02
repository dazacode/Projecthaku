import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Chat {
  id: string
  title: string
  created_at: string
  user_email: string
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  const fetchChats = async () => {
    if (status === "loading") return
    if (!session?.user?.email) {
      toast.error("Please sign in to continue")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/chats")
      if (!response.ok) {
        throw new Error("Failed to fetch chats")
      }
      const data = await response.json()
      setChats(data)
    } catch (error) {
      console.error("Error fetching chats:", error)
      toast.error("Failed to fetch chats")
    } finally {
      setIsLoading(false)
    }
  }

  const createChat = async (title: string) => {
    if (status === "loading") return null
    if (!session?.user?.email) {
      toast.error("Please sign in to continue")
      return null
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to create chat")
      }

      const chat = await response.json()
      setChats((prev) => [chat, ...prev])
      return chat
    } catch (error) {
      console.error("Error creating chat:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create chat")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    if (status === "loading") return
    if (!session?.user?.email) {
      toast.error("Please sign in to continue")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/chats?id=${chatId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to delete chat")
      }

      setChats((prev) => prev.filter((chat) => chat.id !== chatId))
      toast.success("Chat deleted")
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete chat")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status !== "loading" && session?.user?.email) {
      fetchChats()
    }
  }, [status, session?.user?.email])

  return {
    chats,
    isLoading,
    createChat,
    deleteChat,
    refreshChats: fetchChats,
  }
}
