const {
  errorWithDefaultMessage,
  successWithData,
} = require("../../utils/http_response_message");
const { getMovieByLink } = require("../../utils/scrapper");

exports.getMovieDetail = async (req, res) => {
  try {
    const { player } = req.query;
    if (player) {
      req.body.link += `?player=${player}`;
    }
    console.log(req.body.link);
    const movie = await getMovieByLink(req.body.link ?? req.params.link);
    res.status(200).json(successWithData(movie));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};