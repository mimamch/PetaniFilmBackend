-- CreateTable
CREATE TABLE "GenresOnMovies" (
    "movieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenresOnMovies_pkey" PRIMARY KEY ("movieId","genreId")
);

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
