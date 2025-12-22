import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Generate a unique meeting room for a live session
export async function createMeetingRoom(sessionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: {
      teacher: {
        include: { user: true }
      },
      student: true,
    },
  });

  if (!liveSession) {
    throw new Error("Session not found");
  }

  // Check if user is either the teacher or student
  const isTeacher = liveSession.teacher.userId === session.user.id;
  const isStudent = liveSession.studentId === session.user.id;

  if (!isTeacher && !isStudent) {
    throw new Error("Unauthorized to access this session");
  }

  // Generate meeting room ID and details
  const meetingRoomId = `room_${sessionId}_${Date.now()}`;
  const meetingData = {
    roomId: meetingRoomId,
    sessionId: sessionId,
    teacherId: liveSession.teacherId,
    studentId: liveSession.studentId,
    scheduledStart: liveSession.scheduledAt,
    provider: "agora", // Default provider
    status: "scheduled",
  };

  // Update the live session with meeting room details
  await prisma.liveSession.update({
    where: { id: sessionId },
    data: {
      // Add meeting room details to the session (you might want to add these fields to your schema)
      // meetingRoomId: meetingRoomId,
      // meetingProvider: "agora",
    },
  });

  return meetingData;
}

// Get meeting room details for a session
export async function getMeetingRoom(sessionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: {
      teacher: {
        include: { user: true }
      },
      student: true,
    },
  });

  if (!liveSession) {
    throw new Error("Session not found");
  }

  // Check if user is either the teacher or student
  const isTeacher = liveSession.teacher.userId === session.user.id;
  const isStudent = liveSession.studentId === session.user.id;

  if (!isTeacher && !isStudent) {
    throw new Error("Unauthorized to access this session");
  }

  return {
    sessionId: liveSession.id,
    roomId: `room_${sessionId}`,
    isTeacher,
    isStudent,
    teacherName: liveSession.teacher.user.name,
    studentName: liveSession.student?.name || "Student",
    sessionTitle: liveSession.title || "Live Session",
    scheduledTime: liveSession.scheduledAt,
    duration: liveSession.duration,
    status: liveSession.status,
  };
}

// Update session status when meeting starts/ends
export async function updateSessionStatus(sessionId: string, status: "InProgress" | "Completed") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: { teacher: true },
  });

  if (!liveSession) {
    throw new Error("Session not found");
  }

  // Check if user is either the teacher or student
  const isTeacher = liveSession.teacher.userId === session.user.id;
  const isStudent = liveSession.studentId === session.user.id;

  if (!isTeacher && !isStudent) {
    throw new Error("Unauthorized to access this session");
  }

  await prisma.liveSession.update({
    where: { id: sessionId },
    data: {
      status,
      ...(status === "InProgress" && { actualStartTime: new Date() }),
      ...(status === "Completed" && { actualEndTime: new Date() }),
    },
  });

  revalidatePath("/dashboard/sessions");
  return { success: true };
}

// Generate Agora token (simplified - in production you'd call your token server)
export async function generateAgoraToken(channelName: string, userId: string) {
  // This is a simplified version. In production, you'd have a separate service
  // that generates tokens using your Agora App ID and App Certificate

  const token = `agora_token_${channelName}_${userId}_${Date.now()}`;

  return {
    token,
    channelName,
    userId,
    appId: process.env.AGORA_APP_ID || "demo_app_id",
  };
}

// Get available video conferencing providers
export async function getVideoProviders() {
  return [
    {
      id: "agora",
      name: "Agora",
      description: "Real-time video and voice communication",
      available: true,
      features: ["HD Video", "Screen Share", "Recording", "Chat"],
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Professional video meetings",
      available: false, // Would need Zoom SDK integration
      features: ["HD Video", "Screen Share", "Recording", "Breakout Rooms"],
    },
    {
      id: "webrtc",
      name: "WebRTC",
      description: "Browser-based video calling",
      available: true,
      features: ["Peer-to-peer", "No downloads", "Low latency"],
    },
  ];
}