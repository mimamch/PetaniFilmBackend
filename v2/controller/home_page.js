const {
  errorWithMessage,
  errorWithDefaultMessage,
  successWithData,
} = require("../../utils/http_response_message");
const {
  getHomePage,
  searchQuery,
  getByGenre,
} = require("../../utils/scrapper");

exports.getHomePageData = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await getHomePage(page);
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};

exports.getMovieByGenre = async (req, res) => {
  try {
    const { page = 1, genre } = req.query;
    const data = await getByGenre(page, genre);
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};

exports.searchQuery = async (req, res) => {
  try {
    const data = await searchQuery(req.query.search);
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};
