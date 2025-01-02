import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    // For now, return a simple response
    const response = {
      message: "Hello! I'm Haku, your Japanese learning assistant. How can I help you today?"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in AI response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
