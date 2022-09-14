/*
  Warnings:

  - The `popularity` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `voteAverage` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "imdbId" SET DATA TYPE TEXT,
DROP COLUMN "popularity",
ADD COLUMN     "popularity" DOUBLE PRECISION,
ALTER COLUMN "voteAverage" SET DATA TYPE DOUBLE PRECISION;
