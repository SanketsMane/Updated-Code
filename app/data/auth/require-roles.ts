import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireTeacherOrAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  if ((session.user as any).role !== "admin" && (session.user as any).role !== "teacher") {
    return redirect("/not-admin");
  }

  return session as typeof session & { user: { role: string | null } };
});

export const requireTeacher = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  if ((session.user as any).role !== "teacher" && (session.user as any).role !== "admin") {
    return redirect("/not-admin");
  }

  return session as typeof session & { user: { role: string | null } };
});

export const requireAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  if ((session.user as any).role !== "admin") {
    return redirect("/not-admin");
  }

  return session as typeof session & { user: { role: string | null } };
});

export const getSessionWithRole = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session as typeof session & { user: { role: string | null } };
});