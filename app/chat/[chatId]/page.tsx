"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { useChats } from "@/hooks/useChats"
import { useSession } from "next-auth/react"
import { Message } from "@/types/chat"
import { toast } from "sonner"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.chatId as string
  const { data: session } = useSession()
  const { chats, deleteChat } = useChats()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  const [isOpenSubscription, setIsOpenSubscription] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // ... rest of your code
} 