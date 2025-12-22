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

  if (session.user.role !== "admin" && session.user.role !== "teacher") {
    return redirect("/not-admin");
  }

  return session;
});

export const requireTeacher = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  if (session.user.role !== "teacher" && session.user.role !== "admin") {
    return redirect("/not-admin");
  }

  return session;
});

export const getSessionWithRole = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});