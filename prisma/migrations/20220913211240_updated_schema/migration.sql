/*
  Warnings:

  - You are about to drop the column `genresId` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "genresId",
ADD COLUMN     "tmdbGenresId" INTEGER[];
