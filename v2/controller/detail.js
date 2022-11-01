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
    const { player = 1 } = req.query;
    if (player) {
      req.body.link += `?player=${player}`;
    }
    if (req.body.link.includes("/tv/")) return this.getTvDetail(req, res);
    const movie = await getMovieByLink(req.body.link ?? req.params.link, {
      player: player,
    });
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
    let { player = 1 } = req.query;
    const linkPlayer = new URL(req.body.link).searchParams.get("player");
    if (linkPlayer) {
      player = linkPlayer;
    }
    if (player) {
      req.body.link += `?player=${player}`;
    }
    const data = await getTvEpisode(req.body.link, {
      player: player,
    });
    res.status(200).json(successWithData(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};
