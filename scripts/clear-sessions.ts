import { prisma } from "@/lib/db";

async function clearSessions() {
  try {
    console.log("🧹 Clearing all active sessions...");
    
    // Delete all sessions from the database
    const result = await prisma.session.deleteMany({});
    
    console.log(`✅ Cleared ${result.count} sessions successfully!`);
    console.log("🔐 All users are now logged out. Fresh authentication required.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clear sessions:", error);
    process.exit(1);
  }
}

clearSessions();