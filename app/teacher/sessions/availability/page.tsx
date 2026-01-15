
import { requireTeacher } from "@/app/data/auth/require-roles";
import { AvailabilitySettings } from "./_components/AvailabilitySettings";

export const dynamic = "force-dynamic";

export default async function TeacherAvailabilityPage() {
    await requireTeacher();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Availability</h1>
                <p className="text-muted-foreground mt-1">
                    Set your recurring availability for weekly and 1-on-1 sessions.
                </p>
            </div>

            <AvailabilitySettings />
        </div>
    );
}
