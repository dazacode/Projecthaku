import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createSupabaseServerSide } from "@/lib/supabase/server"

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const supabase = await createSupabaseServerSide()
    
    // First get the chat to verify ownership
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", params.chatId)
      .eq("user_email", session.user.email)
      .single()

    if (chatError || !chat) {
      return new NextResponse("Chat not found", { status: 404 })
    }

    // Then get the messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", params.chatId)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return new NextResponse(messagesError.message, { status: 500 })
    }

    return NextResponse.json({ chat, messages })
  } catch (error) {
    console.error("Error in GET /api/chat/[chatId]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
