import { ReactNode } from "react";

export default function VideoCallLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}