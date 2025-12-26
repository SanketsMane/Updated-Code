import { NextRequest, NextResponse } from "next/server";
import { getUserConversations, getConversationMessages, sendMessage, markMessagesAsRead, searchUsersForChat, getOrCreateConversation } from "@/app/actions/messages";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const messages = await getConversationMessages(conversationId);
      return NextResponse.json(messages);
    } else {
      const conversations = await getUserConversations();
      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, conversationId, message, query, userId } = await request.json();

    switch (action) {
      case "sendMessage":
        await sendMessage(conversationId, message);
        return NextResponse.json({ success: true });

      case "markAsRead":
        await markMessagesAsRead(conversationId);
        return NextResponse.json({ success: true });

      case "searchUsers":
        const users = await searchUsersForChat(query);
        return NextResponse.json(users);

      case "createConversation":
        const conversation = await getOrCreateConversation(userId);
        return NextResponse.json(conversation);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in messages API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}