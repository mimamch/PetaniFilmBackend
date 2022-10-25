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
} = require("./scrapper_function");
const getMovieByLink = async (link) => {
  try {
    if (link.includes("/tv/")) return;
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
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getMovieByLink("http://185.99.135.232/keluarga-cemara-2019/");

const getTvByLink = async (link) => {
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

const getTvEpisode = async (link) => {
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

const getHomePage = async () => {
  try {
    const page = await axios.get("http://185.99.135.232/");
    const { window, ...dom } = new JSDOM(page.data);
    const lastUploaded = getLastUploaded(window.document);
    console.log(lastUploaded);
    return {
      last_uploaded: lastUploaded,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
getHomePage();
