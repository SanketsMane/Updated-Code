import { getSessionWithRole } from "../data/auth/require-roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DebugUserPage() {
  const session = await getSessionWithRole();

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Current User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={session.user.role === "admin" ? "default" : session.user.role === "teacher" ? "secondary" : "outline"}>
                    {session.user.role || "No Role"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-xs">{session.user.id}</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-sm font-medium">Navigate to your dashboard:</p>
                <div className="flex gap-2">
                  {session.user.role === "admin" && (
                    <Button asChild>
                      <Link href="/admin">Go to Admin Dashboard</Link>
                    </Button>
                  )}
                  {session.user.role === "teacher" && (
                    <Button asChild>
                      <Link href="/teacher">Go to Teacher Dashboard</Link>
                    </Button>
                  )}
                  {(!session.user.role || session.user.role === "student") && (
                    <Button asChild>
                      <Link href="/dashboard">Go to Student Dashboard</Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div>
              <p>Not logged in</p>
              <Button asChild className="mt-4">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
