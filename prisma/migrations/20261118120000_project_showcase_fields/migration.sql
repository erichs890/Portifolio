-- AlterTable: showcase fields for cards, filters and the featured layout (additive only)
ALTER TABLE "projects" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuredStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlightsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "projectDate" TIMESTAMP(3),
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "summaryEn" TEXT;
