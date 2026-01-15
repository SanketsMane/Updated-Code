
import { TeacherCalendarClient } from "./_components/teacher-calendar-client";

export const dynamic = "force-dynamic";

export default function TeacherCalendarPage() {
  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Schedule & Calendar</h1>
          <p className="text-muted-foreground text-sm">Manage your upcoming sessions and classes.</p>
        </div>
        {/* Placeholder for future Google Calendar Sync */}
        {/* <Button variant="outline" size="sm">Sync Calendar</Button> */}
      </div>

      <TeacherCalendarClient />
    </div>
  );
}
