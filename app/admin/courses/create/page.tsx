import { prisma } from "@/lib/db";
import { CourseForm } from "./_components/course-form";
import { requireUser } from "@/app/data/user/require-user";

export const dynamic = "force-dynamic";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
  return categories;
}

export default async function CourseCreationPage() {
  await requireUser();
  const categories = await getCategories();

  return <CourseForm categories={categories} />;
}
