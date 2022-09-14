-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "tmdbBackdropPath" TEXT,
    "budget" INTEGER,
    "genresId" INTEGER[],
    "homepage" TEXT,
    "tmdbId" INTEGER,
    "imdbId" INTEGER,
    "originalLanguage" TEXT,
    "originalTitle" TEXT,
    "overview" TEXT,
    "popularity" TEXT,
    "tmdbPosterPath" TEXT,
    "releaseDate" TEXT,
    "revenue" INTEGER,
    "runtime" INTEGER,
    "status" TEXT,
    "tagline" TEXT,
    "title" TEXT,
    "video" BOOLEAN,
    "voteAverage" DECIMAL(65,30),
    "voteCount" INTEGER,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);
