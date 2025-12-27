
import dotenv from 'dotenv';
dotenv.config();

console.log("Checking DATABASE_URL...");
const url = process.env.DATABASE_URL;

if (!url) {
    console.log("❌ DATABASE_URL is undefined");
} else if (url.includes("db.prisma.io")) {
    console.log("❌ DATABASE_URL is pointing to placeholder: db.prisma.io");
    console.log("Value:", url);
} else {
    console.log("✅ DATABASE_URL looks correct (local/remote DB)");
    // hide credentials
    console.log("Value starts with:", url.substring(0, 20) + "...");
}
