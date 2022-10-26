const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");
const {
  getTotalStreamingServer,
  getStreamingLink,
  getDownloadLinks,
  getDetail,
  getHomePageItems,
  getGenres,
  getLastUploaded,
  getFeaturedPost,
} = require("./scrapper_function");
exports.getMovieByLink = async (link) => {
  try {
    if (link.includes("/tv/")) throw new Error("Bukan Film");
    const page = await axios.get(link);

    const { window, ...dom } = new JSDOM(page.data);
    const totalStreamServer = getTotalStreamingServer(window.document);
    const streamingLink = getStreamingLink(window.document);
    const downloadLinks = getDownloadLinks(window.document);
    const detail = getDetail(window.document);
    const result = {
      type: "movie",
      total_streaming_server: totalStreamServer,
      streaming_link: streamingLink,
      download_links: downloadLinks,
      detail: detail,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getMovieByLink("http://185.99.135.232/keluarga-cemara-2019/");

exports.getTvByLink = async (link) => {
  try {
    const page = await axios.get(link);
    const { window, ...dom } = new JSDOM(page.data);
    const episodes = Array.from(
      window.document.querySelectorAll(".button.button-shadow")
    ).map((e, i) => e.href);
    episodes.shift();
    const totalEpisodes = episodes.length;

    const streamingLink = getStreamingLink(window.document);
    const detail = getDetail(window.document);
    const result = {
      type: "movie",
      total_episodes: totalEpisodes,
      streaming_link: streamingLink,
      episodes: episodes,
      detail: detail,
    };
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getTvByLink("http://185.99.135.232/tv/the-queens-umbrella-2022/");

exports.getTvEpisode = async (link) => {
  try {
    const page = await axios.get(link);
    const { window, ...dom } = new JSDOM(page.data);

    const totalStreamServer = getTotalStreamingServer(window.document);
    const streamingLink = getStreamingLink(window.document);
    const downloadLinks = getDownloadLinks(window.document);
    const result = {
      type: "tv",
      total_streaming_server: totalStreamServer,
      streaming_link: streamingLink,
      download_links: downloadLinks,
    };
    console.log(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getTvEpisode("http://185.99.135.232/eps/the-queens-umbrella-episode-1/");

exports.getHomePage = async (pageCount = 1) => {
  try {
    const page = await axios.get(`http://185.99.135.232/page/${pageCount}`);
    const { window, ...dom } = new JSDOM(page.data);
    const lastUploaded = getLastUploaded(window.document);
    let totalPages = Array.from(
      window.document.querySelectorAll(".page-numbers")
    );
    totalPages.pop();
    totalPages = parseInt(totalPages.pop().textContent);

    const featuredPost = getFeaturedPost(window.document);
    return {
      last_uploaded: {
        total_pages: parseInt(totalPages),
        current_page: parseInt(pageCount),
        data: lastUploaded,
      },
      featured_post: featuredPost,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
this.getHomePage();
