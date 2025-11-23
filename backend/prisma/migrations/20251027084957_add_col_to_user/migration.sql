-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "gender" "GenderType";
