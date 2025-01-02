import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseServerSide } from "@/lib/supabase/server";

// Get message count
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const supabase = await createSupabaseServerSide();
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact" })
      .eq("user_email", userEmail)
      .eq("role", "user")
      .gte("created_at", startOfMonth.toISOString());

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add usage tracking message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const supabase = await createSupabaseServerSide();

    // First, get the current count
    const { count: currentCount, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact" })
      .eq("user_email", userEmail)
      .eq("role", "user")
      .gte("created_at", startOfMonth.toISOString());

    if (countError) {
      console.error("Error getting message count:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Add tracking message
    const { error: insertError } = await supabase
      .from("messages")
      .insert({
        chat_id: "00000000-0000-0000-0000-000000000000", // Special tracking chat
        user_email: userEmail,
        role: "system",
        content: {
          type: "usage_tracking",
          count: (currentCount || 0) + 1,
          timestamp: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error("Error inserting tracking message:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ count: (currentCount || 0) + 1 });
  } catch (error) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
