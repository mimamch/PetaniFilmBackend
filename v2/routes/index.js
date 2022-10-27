const { Router } = require("express");
const { getMovieDetail } = require("../controller/detail");
const { getHomePageData } = require("../controller/home_page");
const router = Router();

router.get("/home_page", getHomePageData);
router.get("/get-movie-by-link/:link", getMovieDetail);
router.post("/get-movie-by-link", getMovieDetail);

module.exports = router;