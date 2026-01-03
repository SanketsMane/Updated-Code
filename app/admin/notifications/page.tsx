import { requireUser } from "@/app/data/user/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBell, IconSend, IconUsers } from "@tabler/icons-react";

export default async function NotificationsPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <IconBell className="h-8 w-8" />
          Send Notifications
        </h1>
        <p className="text-muted-foreground">Send announcements and notifications to users</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Broadcast messages to platform users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Send To</Label>
              <select id="recipients" className="w-full p-2 border rounded-md">
                <option>All Users</option>
                <option>All Students</option>
                <option>All Teachers</option>
                <option>All Admins</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Notification subject" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here..." rows={6} />
            </div>
            <Button className="w-full">
              <IconSend className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Previously sent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Platform Update v2.0</p>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">New features and improvements are now live!</p>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sent to All Users</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Holiday Schedule</p>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Platform maintenance scheduled for...</p>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sent to All Users</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground py-4">No more notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
