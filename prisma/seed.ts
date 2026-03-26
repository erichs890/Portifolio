import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("132465", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "erichs890@gmail.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // Create technologies
  const technologies = await Promise.all([
    prisma.technology.create({
      data: {
        name: "React",
        slug: "react",
        color: "#61DAFB",
      },
    }),
    prisma.technology.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        color: "#000000",
      },
    }),
    prisma.technology.create({
      data: {
        name: "TypeScript",
        slug: "typescript",
        color: "#3178C6",
      },
    }),
    prisma.technology.create({
      data: {
        name: "Tailwind CSS",
        slug: "tailwind",
        color: "#06B6D4",
      },
    }),
    prisma.technology.create({
      data: {
        name: "PostgreSQL",
        slug: "postgresql",
        color: "#336791",
      },
    }),
    prisma.technology.create({
      data: {
        name: "Prisma",
        slug: "prisma",
        color: "#2D3748",
      },
    }),
  ]);
  console.log("✅ Technologies created:", technologies.length);

  console.log("\n✨ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("🔴 Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
