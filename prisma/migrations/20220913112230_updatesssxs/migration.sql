/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");
