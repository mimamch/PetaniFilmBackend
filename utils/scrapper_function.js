const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");

exports.getTotalStreamingServer = (document) => {
  const streamServerDom = document.querySelector(
    ".muvipro-player-tabs.nav.nav-tabs.clearfix"
  );
  return streamServerDom.children.length;
};

exports.getStreamingLink = (document) => {
  let data = document.querySelector(".gmr-embed-responsive > iframe")?.src;
  return data;
};
exports.getStreamingLink2 = async (document, player = 1) => {
  const movieid = document
    .querySelector("#muvipro_player_content_id")
    .getAttribute("data-id");
  const data = await axios
    .post(
      `${process.env.WEB_BASE_URL}/wp-admin/admin-ajax.php`,
      new URLSearchParams({
        action: "muvipro_player_content",
        tab: `p${player}`,
        post_id: movieid,
      })
    )
    .then((e) => {
      return new JSDOM(e.data).window.document.querySelector("iframe").src;
    })
    .catch((err) => {
      return null;
    });
  return data;
};

exports.getDownloadLinks = (document) => {
  const downloadLinksDom = Array.from(
    document.querySelectorAll(
      ".list-inline.gmr-download-list.clearfix > li > a"
    )
  );
  return downloadLinksDom.map((e) => ({
    label: e.textContent,
    link: e.href,
  }));
};

exports.getTitle = (document) =>
  document.querySelector(".entry-title").textContent;
exports.getDescription = (document) =>
  document.querySelector("[itemprop=description] > p")?.textContent;
exports.getReleaseDate = (document) =>
  document.querySelector("[itemprop=dateCreated]")?.textContent;
exports.getGenres = (document) =>
  Array.from(
    document.querySelectorAll(`.gmr-moviedata > [rel="category tag"]`)
  ).map((e) => e?.textContent);
exports.getGenres2 = (document) =>
  Array.from(
    document.querySelectorAll(`.gmr-moviedata > [rel="category tag"]`)
  ).map((e) => {
    const slugs = e?.href?.split("/");
    return { label: e?.textContent, slug: slugs[slugs.length - 2] };
  });
exports.getCountry = (document) =>
  document.querySelector('.gmr-moviedata > [itemprop="contentLocation"]')
    ?.textContent;
exports.getRating = (document) => {
  const rating =
    document.querySelector('.gmr-meta-rating > [itemprop="ratingValue"]')
      ?.textContent ?? "0";
  return parseFloat(rating);
};
exports.getPosterUrl = (document) =>
  document.querySelector('meta[property="og:image"]')?.content ?? null;
exports.getActors = (document) =>
  Array.from(
    document.querySelectorAll(".gmr-moviedata span[itemprop=actors]")
  ).map((e) => e.textContent);
exports.getRelatedPost = (document) =>
  Array.from(document.querySelectorAll(".row.grid-container > article")).map(
    (e) => {
      return {
        title: e.querySelector(".entry-title")?.textContent,
        url: e.querySelector("[itemprop=url]")?.href,
        genres: Array.from(e.querySelectorAll(`[rel="category tag"]`)).map(
          (e) => e?.textContent
        ),
        duration: e.querySelector(".gmr-duration-item")?.textContent?.trim(),
        poster_url: e.querySelector("img")?.src,
        rating:
          Math.round(
            parseFloat(e.querySelector(".gmr-rating-item")?.textContent ?? 0) *
              10
          ) / 10,
        quality: e.querySelector(".gmr-quality-item > a")?.textContent,
        type: e.querySelector(".gmr-posttype-item")?.textContent
          ? "tv"
          : "movie",
        trailer: e.querySelector(".button.gmr-trailer-popup")?.href,
      };
    }
  );

exports.getDetail = (document) => {
  const title = this.getTitle(document);
  const description = this.getDescription(document);
  const releaseDate = this.getReleaseDate(document);
  const genres = this.getGenres(document);
  const genres2 = this.getGenres2(document);
  const country = this.getCountry(document);
  const rating = this.getRating(document);
  const posterUrl = this.getPosterUrl(document);

  const actors = this.getActors(document);

  const relatedPost = this.getRelatedPost(document);
  return {
    title: title,
    description: description,
    release_date: releaseDate,
    year: parseInt(releaseDate?.split(" ")?.pop() ?? 0),
    genres: genres,
    genres2: genres2,
    country: country,
    rating: rating,
    poster_url: posterUrl,
    actors: actors,
    related_post: relatedPost,
  };
};

exports.getLastUploaded = (document) => {
  return Array.from(document.querySelectorAll("#gmr-main-load > article")).map(
    (e) => {
      return {
        title: e.querySelector(".entry-title > a")?.textContent,
        url: e.querySelector("[itemprop=url]")?.href,
        genres: Array.from(e.querySelectorAll(`[rel="category tag"]`)).map(
          (e) => e?.textContent
        ),
        duration: e.querySelector(".gmr-duration-item")?.textContent?.trim(),
        poster_url: e.querySelector("img")?.src,
        rating:
          Math.round(
            parseFloat(e.querySelector(".gmr-rating-item")?.textContent ?? 0) *
              10
          ) / 10,
        quality: e.querySelector(".gmr-quality-item > a")?.textContent,
        type: e.querySelector(".gmr-posttype-item")?.textContent
          ? "tv"
          : "movie",
        trailer: e.querySelector(".button.gmr-trailer-popup")?.href,
      };
    }
  );
};

exports.getFeaturedPost = (document) =>
  Array.from(document.querySelectorAll(".gmr-slider-content")).map((e) => {
    return {
      url: e.querySelector("[itemprop=url]")?.href,
      poster_url: e.querySelector("img")?.getAttribute("data-src"),
      title: e.querySelector(".gmr-slide-titlelink")?.textContent,
      quality: e.querySelector(".gmr-quality-item")?.textContent,
      type: e.querySelector("[itemprop=url]")?.href.includes("/tv/")
        ? "tv"
        : "movie",
    };
  });
