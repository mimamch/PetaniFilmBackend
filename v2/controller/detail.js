const {
  errorWithDefaultMessage,
  successWithData,
} = require("../../utils/http_response_message");
const {
  getMovieByLink,
  getTvByLink,
  getTvEpisode,
} = require("../../utils/scrapper");

exports.getMovieDetail = async (req, res) => {
  try {
    const { player } = req.query;
    if (player) {
      req.body.link += `?player=${player}`;
    }
    if (req.body.link.includes("/tv/")) return this.getTvDetail(req, res);
    const movie = await getMovieByLink(req.body.link ?? req.params.link);
    res.status(200).json(successWithData(movie));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};

exports.getTvDetail = async (req, res) => {
  try {
    if (!req.body.link.includes("/tv/")) return this.getMovieDetail(req, res);
    const data = await getTvByLink(req.body.link);
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};
exports.getTvByEpisode = async (req, res) => {
  try {
    const data = await getTvEpisode(req.body.link);
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};
