import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      return redirect("/");
    }
  } catch (error) {
    console.error("Failed to get session in login page:", error);
    // Continue content rendering even if session check fails, likely safe to show login form
  }

  return <LoginForm />;
}
