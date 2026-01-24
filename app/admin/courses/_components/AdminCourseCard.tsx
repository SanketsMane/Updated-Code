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
    <Card className="group relative py-0 gap-0 h-full flex flex-col">
      {/* absolute dropdrown */}
      <div className="absolute top-2 right-2 z-10">
        <CourseActions courseId={data.id} slug={data.slug} />
      </div>

      <div className="absolute top-2 left-2 z-10">
        <Badge className={
          data.status === "Published" ? "bg-green-500 hover:bg-green-600" :
            (data.status as string) === "Pending" ? "bg-yellow-500 hover:bg-yellow-600 text-black" :
              "bg-secondary hover:bg-secondary/80"
        }>
          {data.status}
        </Badge>
      </div>

      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt="Thumbnail Url"
          width={600}
          height={400}
          className="w-full rounded-t-lg aspect-video object-cover"
        />
      ) : (
        <div className="w-full rounded-t-lg aspect-video bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No thumbnail</p>
        </div>
      )}

      <CardContent className="p-4 flex flex-col flex-1">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 mb-auto">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
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
