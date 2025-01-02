import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createSupabaseServerSide } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const supabase = await createSupabaseServerSide()
    const { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_email", session.user.email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching chats:", error)
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error in GET /api/chats:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title } = await req.json()
    if (!title) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const supabase = await createSupabaseServerSide()
    const { data: chat, error } = await supabase
      .from("chats")
      .insert({
        title,
        user_email: session.user.email
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating chat:", error)
      return new NextResponse(error.message, { status: 500 })
    }

    if (!chat) {
      return new NextResponse("Failed to create chat", { status: 500 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error in POST /api/chats:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return new NextResponse(message, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return new NextResponse("Chat ID is required", { status: 400 })
    }

    const supabase = await createSupabaseServerSide()
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", id)
      .eq("user_email", session.user.email)

    if (error) {
      console.error("Error deleting chat:", error)
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error in DELETE /api/chats:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return new NextResponse(message, { status: 500 })
  }
}
