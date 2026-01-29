import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Attempting to connect to database...");
    const settings = await prisma.siteSettings.findFirst();
    console.log("Successfully connected! settings found:", !!settings);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
