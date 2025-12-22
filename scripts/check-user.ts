
import { prisma } from "../lib/db";

async function checkUser() {
    const email = "teacher@kidokool.com";
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        console.log("USER EXISTS:", user.id);
    } else {
        console.log("USER DOES NOT EXIST");
    }
}

checkUser();
