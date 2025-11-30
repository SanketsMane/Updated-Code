import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Get or create conversation between two users
export async function getOrCreateConversation(participantId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;
  
  // Don't create conversation with yourself
  if (currentUserId === participantId) {
    throw new Error("Cannot create conversation with yourself");
  }

  // Try to find existing conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        {
          participant1Id: currentUserId,
          participant2Id: participantId,
        },
        {
          participant1Id: participantId,
          participant2Id: currentUserId,
        },
      ],
    },
    include: {
      participant1: {
        select: { id: true, name: true, image: true },
      },
      participant2: {
        select: { id: true, name: true, image: true },
      },
      lastMessage: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  // Create new conversation if doesn't exist
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participant1Id: currentUserId,
        participant2Id: participantId,
      },
      include: {
        participant1: {
          select: { id: true, name: true, image: true },
        },
        participant2: {
          select: { id: true, name: true, image: true },
        },
        lastMessage: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  return conversation;
}

// Send a new message
export async function sendMessage(conversationId: string, content: string, messageType: "Text" | "Image" | "File" | "Video" | "Audio" = "Text") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;

  // Verify user is part of the conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { participant1Id: currentUserId },
        { participant2Id: currentUserId },
      ],
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found or access denied");
  }

  // Determine receiver ID
  const receiverId = conversation.participant1Id === currentUserId 
    ? conversation.participant2Id 
    : conversation.participant1Id;

  // Create the message
  const message = await prisma.message.create({
    data: {
      senderId: currentUserId,
      receiverId,
      conversationId,
      content,
      messageType,
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Update conversation's last message and activity
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageId: message.id,
      lastActivity: new Date(),
    },
  });

  revalidatePath("/dashboard/messages");
  return message;
}

// Get conversation messages
export async function getConversationMessages(conversationId: string, page: number = 1, limit: number = 50) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;

  // Verify user is part of the conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { participant1Id: currentUserId },
        { participant2Id: currentUserId },
      ],
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found or access denied");
  }

  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
      replies: {
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return messages.reverse(); // Return in chronological order
}

// Get user's conversations
export async function getUserConversations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: currentUserId },
        { participant2Id: currentUserId },
      ],
    },
    include: {
      participant1: {
        select: { id: true, name: true, image: true },
      },
      participant2: {
        select: { id: true, name: true, image: true },
      },
      lastMessage: {
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              receiverId: currentUserId,
              isRead: false,
            },
          },
        },
      },
    },
    orderBy: { lastActivity: "desc" },
  });

  // Add unread count and other participant info
  const conversationsWithData = conversations.map((conv) => {
    const otherParticipant = conv.participant1Id === currentUserId 
      ? conv.participant2 
      : conv.participant1;
    
    return {
      ...conv,
      otherParticipant,
      unreadCount: conv._count.messages,
    };
  });

  return conversationsWithData;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;

  // Verify user is part of the conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { participant1Id: currentUserId },
        { participant2Id: currentUserId },
      ],
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found or access denied");
  }

  // Mark all unread messages in this conversation as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      receiverId: currentUserId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/dashboard/messages");
}

// Search users to start new conversations
export async function searchUsersForChat(query: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const currentUserId = session.user.id;

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } }, // Exclude current user
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      teacherProfile: {
        select: {
          bio: true,
          expertise: true,
        },
      },
    },
    take: 10,
  });

  return users;
}