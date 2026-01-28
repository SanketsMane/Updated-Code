import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { CoursePlayer } from "./_components/CoursePlayer";

export default async function ChapterIdPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string; chapterId: string }>;
    searchParams: Promise<{ lessonId?: string }>;
}) {
    const { slug, chapterId } = await params;
    const { lessonId } = await searchParams;

    // 1. Fetch Course Structure (for sidebar)
    const sidebarData = await getCourseSidebarData(slug);
    if (!sidebarData) return redirect("/");

    const { course } = sidebarData;

    // 2. Determine Active Lesson
    let activeLessonId = lessonId;

    if (!activeLessonId) {
        // Default to the first lesson of the requested chapter
        const chapter = course.chapter.find((c) => c.id === chapterId);
        if (chapter && chapter.lessons.length > 0) {
            activeLessonId = chapter.lessons[0].id;
        } else {
            // If chapter has no lessons, try to find ANY first lesson in the course?
            // Or just let it fail gracefully.
            // For now, if no lessonId and logic fails, we might just not show a player or show a placeholder.
            // But we need lesson data to render the player.
        }
    }

    // 3. Fetch Active Lesson Data
    const lesson = activeLessonId ? await getLessonContent(activeLessonId) : null;

    if (!lesson) {
        return redirect(`/courses/${slug}`);
    }

    // 4. Calculate Next/Prev Lesson logic
    // Flatten all lessons in order
    const allLessons = course.chapter.flatMap((c) => c.lessons);
    const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);

    const nextLessonId = activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1].id : undefined;
    const prevLessonId = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1].id : undefined;


    return (
        <CoursePlayer
            course={course}
            chapterId={chapterId}
            lessonId={lesson.id}
            lesson={lesson}
            nextLessonId={nextLessonId}
            prevLessonId={prevLessonId}
        />
    );
}

export const dynamic = "force-dynamic";
