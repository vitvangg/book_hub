-- CreateEnum
CREATE TYPE "TextLevel" AS ENUM ('normal', 'h2', 'h3');

-- CreateEnum
CREATE TYPE "TextFormat" AS ENUM ('normal', 'bold', 'italic', 'underline');

-- CreateEnum
CREATE TYPE "TextAlign" AS ENUM ('left', 'center', 'right', 'justify');

-- AlterTable
ALTER TABLE "block" ADD COLUMN     "textAlign" "TextAlign",
ADD COLUMN     "textFormat" "TextFormat",
ADD COLUMN     "textLevel" "TextLevel";
