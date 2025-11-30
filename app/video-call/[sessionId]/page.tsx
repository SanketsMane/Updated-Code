import { notFound } from "next/navigation";
import VideoCall from "@/components/video/VideoCall";
import { getMeetingRoom } from "@/app/actions/video-call";

interface VideoCallPageProps {
  params: {
    sessionId: string;
  };
}

export default async function VideoCallPage({ params }: VideoCallPageProps) {
  try {
    // Verify the session exists and user has access
    await getMeetingRoom(params.sessionId);
    
    return (
      <div className="h-screen w-screen bg-gray-900">
        <VideoCall 
          sessionId={params.sessionId}
          onCallEnd={() => {
            // Redirect back to sessions after call ends
            window.location.href = "/dashboard/sessions";
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Video call access error:", error);
    notFound();
  }
}