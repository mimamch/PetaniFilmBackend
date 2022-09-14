/*
  Warnings:

  - A unique constraint covering the columns `[tmdbGenreId]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmdbGenreId` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "tmdbGenreId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_tmdbGenreId_key" ON "Genre"("tmdbGenreId");
