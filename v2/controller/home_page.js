const {
  errorWithMessage,
  errorWithDefaultMessage,
  successWithData,
} = require("../../utils/http_response_message");
const { getHomePage } = require("../../utils/scrapper");

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
