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

    const supabase = createSupabaseServerSide()
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", params.chatId)
      .eq("user_email", session.user.email)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
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

    const { content, role } = await req.json()
    const supabase = createSupabaseServerSide()
    
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        chat_id: params.chatId,
        user_email: session.user.email,
        content,
        role
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating message:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    // Update chat title if it's the first user message
    if (role === "user") {
      const { data: messages } = await supabase
        .from("messages")
        .select("id")
        .eq("chat_id", params.chatId)
        .eq("user_email", session.user.email)

      if (messages && messages.length === 1) {
        const title = typeof content === "string" 
          ? content.slice(0, 50) 
          : content.text?.slice(0, 50) || "New Chat"

        await supabase
          .from("chats")
          .update({ title })
          .eq("id", params.chatId)
          .eq("user_email", session.user.email)
      }
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error in POST /api/messages/[chatId]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
