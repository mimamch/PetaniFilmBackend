-- CreateTable
CREATE TABLE "SubtitleLink" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "imdbId" INTEGER NOT NULL,
    "provider" TEXT,

    CONSTRAINT "SubtitleLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubtitleLink" ADD CONSTRAINT "SubtitleLink_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Movie"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;
