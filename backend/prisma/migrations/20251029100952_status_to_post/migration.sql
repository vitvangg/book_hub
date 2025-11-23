-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'published');

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'draft';
