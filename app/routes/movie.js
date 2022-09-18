const {
  getMovieByTmdbId,
  getMovieByImdbId,
  addMovieDownloadLinks,
  addMovieStreamingLinks,
  getMovieLinks,
  addMovieByTmdbId,
  getAllMovies,
  deleteMovieByid,
  getMovieSubtitles,
  addMovieSubtitlesLinks,
} = require("../controllers/movie");
const router = require("express").Router();

router.post("/add-movie-by-tmdb-id", addMovieByTmdbId);
router.get("/get-movies", getAllMovies);
router.get("/get-movie-by-tmdb-id/:id", getMovieByTmdbId);
router.get("/get-movie-by-imdb-id/:id", getMovieByImdbId);
router.post("/add-movie-download-links", addMovieDownloadLinks);
router.post("/add-movie-streaming-links", addMovieStreamingLinks);
router.post("/add-movie-subtitles-links", addMovieSubtitlesLinks);
router.get("/get-movie-links", getMovieLinks);
router.get("/get-movie-subtitles", getMovieSubtitles);
router.delete("/delete-movie-by-id/:id", deleteMovieByid);

module.exports = router;
