/*
  Warnings:

  - You are about to drop the `CategoriesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_postId_fkey";

-- DropTable
DROP TABLE "CategoriesOnPosts";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "DownloadLink" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "imdbId" INTEGER NOT NULL,
    "provider" TEXT,
    "size" INTEGER,

    CONSTRAINT "DownloadLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingLink" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "imdbId" INTEGER NOT NULL,
    "provider" TEXT,
    "size" INTEGER,

    CONSTRAINT "StreamingLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Movie"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamingLink" ADD CONSTRAINT "StreamingLink_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Movie"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;
