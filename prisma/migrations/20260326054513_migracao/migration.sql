-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_DEVELOPMENT', 'IN_PRODUCTION', 'FINISHED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "coverImage" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "repositoryUrl" TEXT,
    "liveUrl" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_DEVELOPMENT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3B82F6',
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_published_idx" ON "projects"("published");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_order_idx" ON "projects"("order");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTechnology_AB_unique" ON "_ProjectTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTechnology_B_index" ON "_ProjectTechnology"("B");

-- AddForeignKey
ALTER TABLE "_ProjectTechnology" ADD CONSTRAINT "_ProjectTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnology" ADD CONSTRAINT "_ProjectTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
