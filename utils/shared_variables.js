const path = require("path");
module.exports = {
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  PUBLIC_PATH: path.join(__dirname, "../", "public"),
  API_BASE_URL: process.env.API_BASE_URL,
};
