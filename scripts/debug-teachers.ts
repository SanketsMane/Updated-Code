import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          gender: true,
          country: true,
        },
      },
    },
  });

  console.log("Found " + teachers.length + " teachers.");
  
  teachers.forEach((t, i) => {
    console.log(`Teacher ${i + 1}: ${t.user.name}`);
    console.log(`  Gender: ${t.user.gender}`);
    console.log(`  Country: ${t.user.country}`);
    console.log(`  Expertise: ${JSON.stringify(t.expertise)}`);
    console.log(`  Languages: ${JSON.stringify(t.languages)}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
