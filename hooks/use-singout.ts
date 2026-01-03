"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function useSignOut() {
  const handleSignout = async function signOut() {
    const loadingToast = toast.loading("Signing out...");
    
    try {
      // Use the proper better-auth signOut method
      await authClient.signOut();
    } catch (error) {
      console.log("Sign out completed");
    }
    
    toast.dismiss(loadingToast);
    toast.success("Signed out successfully");
    
    // Use the current origin to maintain the correct port, redirect to home
    const homeUrl = `${window.location.origin}/`;
    
    // Force full page reload to home
    setTimeout(() => {
      window.location.replace(homeUrl);
    }, 100);
  };

  return handleSignout;
}
