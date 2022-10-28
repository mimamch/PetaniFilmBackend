const { Router } = require("express");
const {
  getMovieDetail,
  getTvDetail,
  getTvByEpisode,
} = require("../controller/detail");
const { getHomePageData } = require("../controller/home_page");
const router = Router();

router.get("/home_page", getHomePageData);
router.get("/get-movie-by-link/:link", getMovieDetail);
router.post("/get-movie-by-link", getMovieDetail);
router.post("/get-tv-by-link", getTvDetail);
router.post("/get-tv-episode", getTvByEpisode);

module.exports = router;
