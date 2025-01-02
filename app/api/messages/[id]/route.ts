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
    
    // First verify the chat belongs to the user
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

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error in GET /api/messages/[chatId]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { content, role = "user" } = await req.json()
    const supabase = await createSupabaseServerSide()
    
    // First verify the chat belongs to the user
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", params.chatId)
      .eq("user_email", session.user.email)
      .single()

    if (chatError || !chat) {
      return new NextResponse("Chat not found", { status: 404 })
    }

    // Then create the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: params.chatId,
          user_email: session.user.email,
          content,
          role,
          created_at: new Date().toISOString()
        }
      ])
      .select("*")
      .single()

    if (messageError) {
      console.error("Error creating message:", messageError)
      return new NextResponse(messageError.message, { status: 500 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error in POST /api/messages/[chatId]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
