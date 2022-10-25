const { Router } = require("express");
const { getHomePageData } = require("../controller/home_page");
const router = Router();

router.get("/home_page", getHomePageData);

module.exports = router;
