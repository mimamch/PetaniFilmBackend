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
  getStreamingLink2,
} = require("./scrapper_function");
exports.getMovieByLink = async (
  link,
  { player = 1, web = parseInt(process.env.WEB ?? 1) }
) => {
  try {
    if (link.includes("/tv/")) throw new Error("Bukan Film");
    const page = await axios.get(link);
    const { window, ...dom } = new JSDOM(page.data);
    const totalStreamServer = getTotalStreamingServer(window.document);
    let streamingLink = null;
    if (web == 1) {
      streamingLink = getStreamingLink(window.document);
    } else {
      streamingLink = await getStreamingLink2(window.document, player);
    }
    if (streamingLink?.[0] == "/" && streamingLink?.[1] == "/") {
      streamingLink = "https:" + streamingLink;
    }
    const downloadLinks = getDownloadLinks(window.document);
    const detail = getDetail(window.document);
    const result = {
      type: "movie",
      total_streaming_server: totalStreamServer,
      current_player: parseInt(player),
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

// getMovieByLink("${process.env.WEB_BASE_URL}/keluarga-cemara-2019/");

exports.getTvByLink = async (link) => {
  try {
    const page = await axios.get(link);
    const { window, ...dom } = new JSDOM(page.data);
    const episodes = Array.from(
      window.document.querySelectorAll(".button.button-shadow")
    ).map((e) => ({
      label: e.textContent,
      link: e.href,
    }));
    episodes.shift();
    const totalEpisodes = episodes.length;

    const streamingLink = getStreamingLink(window.document);
    const detail = getDetail(window.document);
    const result = {
      type: "tv",
      total_episodes: totalEpisodes,
      streaming_link: streamingLink,
      episodes: episodes,
      detail: detail,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getTvByLink("${process.env.WEB_BASE_URL}/tv/the-queens-umbrella-2022/");

exports.getTvEpisode = async (
  link,
  { player = 1, web = parseInt(process.env.WEB ?? 1) }
) => {
  try {
    const page = await axios.get(link);
    const { window, ...dom } = new JSDOM(page.data);

    const totalStreamServer = getTotalStreamingServer(window.document);
    let streamingLink = null;
    if (web == 1) {
      streamingLink = getStreamingLink(window.document);
    } else {
      streamingLink = await getStreamingLink2(window.document, player);
    }
    if (streamingLink?.[0] == "/" && streamingLink?.[1] == "/") {
      streamingLink = "https:" + streamingLink;
    }
    const downloadLinks = getDownloadLinks(window.document);
    const result = {
      type: "tv",
      total_streaming_server: totalStreamServer,
      streaming_link: streamingLink,
      current_player: parseInt(player),
      download_links: downloadLinks,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// getTvEpisode("${process.env.WEB_BASE_URL}/eps/the-queens-umbrella-episode-1/");

exports.getHomePage = async (pageCount = 1) => {
  try {
    const page = await axios.get(
      `${process.env.WEB_BASE_URL}/page/${pageCount}`
    );
    const { window, ...dom } = new JSDOM(page.data);
    const lastUploaded = getLastUploaded(window.document);
    let totalPages = Array.from(
      window.document.querySelectorAll(".page-numbers")
    );
    totalPages.pop();
    totalPages = parseInt(totalPages.pop().textContent);

    const genres = Array.from(
      window.document.querySelector('select[name="genre"]').children
    ).map((e) => ({
      label: e.textContent,
      slug: e.value,
    }));
    genres.shift();

    const featuredPost = getFeaturedPost(window.document);
    return {
      last_uploaded: {
        total_pages: parseInt(totalPages),
        current_page: parseInt(pageCount),
        data: lastUploaded,
      },
      genres: genres || [],
      featured_post: featuredPost,
      title1: "Rekomendasi",
      title2: "Baru Diperbarui",
      announcements: [
        {
          label: "TELEGRAM RESMI PETANI FILM HANYA https://t.me/petanifilm",
          action: "launch_url",
          link: "https://t.me/petanifilm",
          color: "#74788d",
        },
      ],
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getByGenre = async (pageCount = 1, genre) => {
  try {
    const page = await axios.get(
      `${process.env.WEB_BASE_URL}/page/${pageCount}?s&search=advanced&genre=${genre}`
    );
    const { window, ...dom } = new JSDOM(page.data);
    const lastUploaded = getLastUploaded(window.document);
    let totalPages = Array.from(
      window.document.querySelectorAll(".page-numbers")
    );

    totalPages.pop();
    totalPages = totalPages.length ? parseInt(totalPages.pop().textContent) : 0;
    return {
      last_uploaded: {
        total_pages: parseInt(totalPages),
        current_page: parseInt(pageCount),
        data: lastUploaded,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.searchQuery = async (query) => {
  try {
    const page = await axios.get(
      `${process.env.WEB_BASE_URL}/?s=${query}&post_type%5B%5D=post&post_type%5B%5D=tv`
    );
    const { window, ...dom } = new JSDOM(page.data);
    // const post = Array.from(window.document.querySelectorAll("article")).map(
    //   (e) => {
    //     return getLastUploaded(window.document);
    //   }
    // );
    const post = getLastUploaded(window.document);
    return post;
  } catch (error) {
    throw error;
  }
};

// (async () => {
//   console.log(
//     await this.getMovieByLink("http://185.99.135.215/v-h-s-99-2022/", {
//       player: 5,
//     })
//   );
// })();
