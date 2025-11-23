/*
  Warnings:

  - You are about to drop the column `follower_id` on the `follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followed_id,following_id]` on the table `follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followed_id` to the `follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."follow" DROP CONSTRAINT "follow_follower_id_fkey";

-- DropIndex
DROP INDEX "public"."follow_follower_id_following_id_key";

-- AlterTable
ALTER TABLE "follow" DROP COLUMN "follower_id",
ADD COLUMN     "followed_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "follow_followed_id_following_id_key" ON "follow"("followed_id", "following_id");

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
