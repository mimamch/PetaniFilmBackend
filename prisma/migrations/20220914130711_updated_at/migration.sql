-- AlterTable
ALTER TABLE "GenresOnMovies" ALTER COLUMN "assignedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
