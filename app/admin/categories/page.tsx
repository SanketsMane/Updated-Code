import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { CategoryDialog } from "./_components/category-dialog";
import { DeleteCategoryButton } from "./_components/delete-category-button";

export const dynamic = "force-dynamic";

async function getCategories() {
    const categories = await prisma.category.findMany({
        include: {
            parent: true,
            _count: {
                select: { courses: true, children: true }
            }
        },
        orderBy: { name: "asc" }
    });
    return categories;
}

export default async function AdminCategoriesPage() {
    // Ensure admin access
    const user = await requireUser();
    // TODO: Double check specific admin role logic if needed, but requireUser + middleware usually covers auth. 
    // Ideally checking role explicitly:
    if (user.role !== "admin") {
        // Handle unauthorized (though middleware should catch this)
        return <div>Unauthorized</div>;
    }

    const categories = await getCategories();

    // Filter top-level categories for the parent selector
    const topLevelCategories = categories.filter(c => !c.parentId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Layers className="h-8 w-8" />
                        Categories
                    </h1>
                    <p className="text-muted-foreground">Manage course categories and hierarchy</p>
                </div>
                <CategoryDialog parentCategories={categories} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        List of all categories in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Courses</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No categories found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {category.icon && <span className="text-lg">{category.icon}</span>}
                                                {category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell>
                                            {category.parent ? <Badge variant="outline">{category.parent.name}</Badge> : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {category._count.courses} courses
                                            {category._count.children > 0 && `, ${category._count.children} sub`}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <CategoryDialog category={category} parentCategories={categories} />
                                                <DeleteCategoryButton id={category.id} name={category.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
