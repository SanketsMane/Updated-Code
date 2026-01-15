import { requireTeacher } from "../../data/auth/require-roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUsers, IconMail, IconEye } from "@tabler/icons-react";
import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendAnnouncementDialog } from "./_components/SendAnnouncementDialog";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  await requireTeacher();
  const session = await getSessionWithRole();

  if (!session?.user?.id) return null;

  // Fetch teacher's courses and their students
  const courses = await prisma.course.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      enrollment: {
        include: {
          User: {
            include: {
              lessonProgress: true,
            }
          }
        }
      },
      chapter: {
        include: {
          lessons: true
        }
      }
    }
  });

  // Calculate total lessons per course for progress calculation
  const courseLessonCounts = new Map<string, number>();
  courses.forEach(course => {
    let count = 0;
    course.chapter.forEach(chapter => {
      count += chapter.lessons.length;
    });
    courseLessonCounts.set(course.id, count);
  });

  // Flatten and process student data
  const studentsMap = new Map();

  courses.forEach(course => {
    course.enrollment.forEach(enrollment => {
      const student = enrollment.User;
      const totalLessons = courseLessonCounts.get(course.id) || 0;

      // Calculate active progress for this course
      const completedLessons = student.lessonProgress.filter(
        p => p.completed && course.chapter.some(c => c.lessons.some(l => l.id === p.lessonId))
      ).length;

      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      if (!studentsMap.has(student.id)) {
        studentsMap.set(student.id, {
          id: student.id,
          name: student.name || "Unknown",
          email: student.email,
          image: student.image,
          courses: [],
          totalProgress: 0,
          lastActive: student.updatedAt // Using User updated timestamp as proxy
        });
      }

      const verifiedStudent = studentsMap.get(student.id);
      verifiedStudent.courses.push({
        title: course.title,
        progress: progress
      });
      verifiedStudent.totalProgress += progress;
    });
  });

  const students = Array.from(studentsMap.values()).map(s => ({
    ...s,
    averageProgress: s.courses.length > 0 ? s.totalProgress / s.courses.length : 0
  }));

  const activeThreshold = new Date();
  activeThreshold.setHours(activeThreshold.getHours() - 24);

  const activeStudentsCount = students.filter(s => new Date(s.lastActive) > activeThreshold).length;
  const averageOverallProgress = students.length > 0
    ? students.reduce((acc, s) => acc + s.averageProgress, 0) / students.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Students</h1>
          <p className="text-muted-foreground">
            Manage and track your students&apos; progress
          </p>
        </div>
        <SendAnnouncementDialog />
      </div>

      {/* Students Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all your courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students (24h)</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Active in last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageOverallProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall course completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Overview of your students and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No students enrolled yet.
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={student.image || ""} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:space-x-8 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-sm font-medium">{student.courses.length}</p>
                      <p className="text-xs text-muted-foreground">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{Math.round(student.averageProgress)}%</p>
                      <p className="text-xs text-muted-foreground">Avg Progress</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-sm font-medium">{new Date(student.lastActive).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Last Update</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <IconEye className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}