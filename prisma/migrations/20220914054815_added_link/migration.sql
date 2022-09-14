/*
  Warnings:

  - Added the required column `link` to the `DownloadLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `StreamingLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `SubtitleLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DownloadLink" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StreamingLink" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubtitleLink" ADD COLUMN     "link" TEXT NOT NULL;
