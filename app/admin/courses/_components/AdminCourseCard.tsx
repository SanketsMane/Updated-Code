import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseActions } from "./course-actions";

import { Badge } from "@/components/ui/badge";
import { CourseApprovalActions } from "./CourseApprovalActions";

interface iAppProps {
  data: AdminCourseType;
  userRole?: string;
}

export function AdminCourseCard({ data, userRole }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0 h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* absolute dropdrown */}
      <div className="absolute top-2 right-2 z-10">
        <CourseActions courseId={data.id} slug={data.slug} />
      </div>

      <div className="absolute top-2 left-2 z-10">
        <Badge className={
          data.status === "Published" ? "bg-green-500 hover:bg-green-600 shadow-sm" :
            (data.status as string) === "Pending" ? "bg-yellow-500 hover:bg-yellow-600 text-black shadow-sm" :
              "bg-secondary hover:bg-secondary/80 shadow-sm"
        }>
          {data.status}
        </Badge>
      </div>

      <div className="w-full aspect-video relative">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
            <School className="size-8 opacity-20 mb-2" />
            <p className="text-xs">No thumbnail</p>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        {/* Instructor info could go here if available */}

        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mt-2 mb-auto">
          {data.smallDescription || "No description provided."}
        </p>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-x-2 text-muted-foreground">
            <TimerIcon className="size-4" />
            <span className="text-xs font-medium">{data.duration}h</span>
          </div>
          <div className="flex items-center gap-x-2 text-muted-foreground">
            <School className="size-4" />
            <span className="text-xs font-medium">{data.level}</span>
          </div>
        </div>

        {(data.status as string) === "Pending" && userRole === "admin" ? (
          <CourseApprovalActions courseId={data.id} />
        ) : (
          <Link
            className={buttonVariants({
              className: "w-full mt-4",
            })}
            href={`/admin/courses/${data.id}/edit`}
          >
            Edit Course <ArrowRight className="size-4 ml-2" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-4 rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>

        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
