-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "movieId" INTEGER[];

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_tmdbGenreId_fkey" FOREIGN KEY ("tmdbGenreId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
