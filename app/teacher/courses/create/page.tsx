import { prisma } from "@/lib/db";
import { CreateCourseForm } from "./_components/create-course-form";

export const dynamic = "force-dynamic";

export default async function CourseCreationPage() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return <CreateCourseForm categories={categories} />;
}
