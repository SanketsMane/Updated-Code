import { requireAdmin } from "../../data/admin/require-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconUsers, 
  IconUserPlus, 
  IconMail, 
  IconPhone, 
  IconCalendar,
  IconEdit,
  IconTrash,
  IconShield,
  IconBook,
  IconStar
} from "@tabler/icons-react";

export default async function AdminTeamPage() {
  await requireAdmin();

  // Mock team data - in real app, fetch from database
  const teamMembers = [
    {
      id: 1,
      name: "Sanket Mane",
      email: "sanketsmane@gmail.com",
      role: "Admin",
      avatar: "/avatars/admin.jpg",
      status: "Active",
      joinedAt: "2024-01-01",
      coursesCreated: 12,
      rating: 4.9,
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Teacher User",
      email: "contactsanket1@gmail.com",
      role: "Teacher",
      avatar: "/avatars/teacher.jpg",
      status: "Active",
      joinedAt: "2024-02-15",
      coursesCreated: 8,
      rating: 4.7,
      phone: "+1 (555) 987-6543",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john.smith@kidokool.com",
      role: "Teacher",
      avatar: "/avatars/john.jpg",
      status: "Active",
      joinedAt: "2024-03-10",
      coursesCreated: 5,
      rating: 4.8,
      phone: "+1 (555) 456-7890",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.johnson@kidokool.com",
      role: "Content Manager",
      avatar: "/avatars/sarah.jpg",
      status: "Active",
      joinedAt: "2024-04-05",
      coursesCreated: 3,
      rating: 4.6,
      phone: "+1 (555) 321-0987",
    },
    {
      id: 5,
      name: "Mike Wilson",
      email: "mike.wilson@kidokool.com",
      role: "Student Support",
      avatar: "/avatars/mike.jpg",
      status: "Inactive",
      joinedAt: "2024-05-20",
      coursesCreated: 0,
      rating: 4.5,
      phone: "+1 (555) 654-3210",
    },
  ];

  const roleColors = {
    Admin: "bg-red-100 text-red-800",
    Teacher: "bg-blue-100 text-blue-800",
    "Content Manager": "bg-green-100 text-green-800",
    "Student Support": "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members, roles, and permissions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <IconUserPlus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <IconShield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.status === "Active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.role === "Teacher").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teamMembers.reduce((acc, m) => acc + m.rating, 0) / teamMembers.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <div className="grid gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {member.name}
                        <Badge 
                          className={roleColors[member.role as keyof typeof roleColors]}
                        >
                          {member.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <IconMail className="h-3 w-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconPhone className="h-3 w-3" />
                          {member.phone}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    Joined {member.joinedAt}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconBook className="h-4 w-4" />
                    {member.coursesCreated} courses created
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconStar className="h-4 w-4" />
                    {member.rating} rating
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <IconEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <IconMail className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    {member.role !== "Admin" && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        <IconTrash className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Configure what each role can access and modify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-red-600 mb-2">Admin</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full system access</li>
                  <li>• User management</li>
                  <li>• Course approval</li>
                  <li>• Analytics access</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">Teacher</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Course creation</li>
                  <li>• Student management</li>
                  <li>• Content editing</li>
                  <li>• Basic analytics</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">Content Manager</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Content review</li>
                  <li>• Media management</li>
                  <li>• Course editing</li>
                  <li>• Quality assurance</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-yellow-600 mb-2">Student Support</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Student assistance</li>
                  <li>• Ticket management</li>
                  <li>• Basic course access</li>
                  <li>• Communication tools</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}