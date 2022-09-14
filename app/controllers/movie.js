const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");
const {
  successWithData,
  errorWithMessage,
  successWithMessage,
} = require("../../utils/http_response_message");
const { TMDB_BASE_URL, TMDB_API_KEY } = require("../../utils/shared_variables");
const prisma = new PrismaClient();

exports.addMovieByTmdbId = async (req, res) => {
  try {
    const { tmdbId } = req.body;
    if (!tmdbId)
      return res.status(400).json(errorWithMessage("Invalid Parameter"));
    const { data } = await axios.get(
      `${TMDB_BASE_URL}/movie/${tmdbId}${TMDB_API_KEY}`
    );
    if (!data)
      return res.status(404).json(errorWithMessage("Request Not Found"));
    console.log(data);
    const genresId = data.genres.map((e) => e.id);
    const genres = data.genres.map((e) => ({
      genre: {
        connect: {
          tmdbGenreId: e.id,
        },
      },
    }));
    const movie = await prisma.movie.create({
      data: {
        adult: data.adult,
        tmdbBackdropPath: data.backdrop_path,
        budget: data.budget,
        tmdbGenresId: genresId,
        genres: {
          create: genres,
        },
        homepage: data.homepage,
        tmdbId: data.id,
        imdbId: data.imdb_id,
        originalLanguage: data.original_language,
        originalTitle: data.original_title,
        overview: data.overview,
        popularity: data.popularity,
        tmdbPosterPath: data.poster_path,
        releaseDate: data.release_date,
        revenue: data.revenue,
        runtime: data.runtime,
        status: data.status,
        tagline: data.tagline,
        title: data.title,
        video: data.video,
        voteAverage: data.vote_average,
        voteCount: data.vote_count,
      },
    });
    if (!movie)
      return res.status(404).json(errorWithMessage("Movie Not Found!"));
    res.json(successWithMessage("Movie Added With Successfully"));
  } catch (error) {
    if (error.code == "P2002") {
      return res.status(409).json(errorWithMessage("Data Already Exist!"));
    }
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.getMovieByTmdbId = async (req, res) => {
  try {
    if (isNaN(req.params.id))
      return res.status(400).json(errorWithMessage("Invalid Parameter"));
    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(req.params.id),
      },
      include: {
        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    // const movie = movie.map((e) => {
    //   return { ...e, genres: e.genres.map((genres) => genres.genre?.name) };
    // });
    if (!movie)
      return res.status(404).json(errorWithMessage("Movie Not Found!"));
    res.json(
      successWithData({
        ...movie,
        genres: movie.genres.map((genres) => genres.genre?.name),
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.getMovieByImdbId = async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        imdbId: req.params.id,
      },
      include: {
        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!movie)
      return res.status(404).json(errorWithMessage("Movie Not Found!"));
    res.json(
      successWithData({
        ...movie,
        genres: movie.genres.map((genres) => genres.genre?.name),
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};

exports.addMovieDownloadLinks = async (req, res) => {
  try {
    const { downloadLinks } = req.body;
    if (!downloadLinks || !downloadLinks.length)
      return res.status(400).json(errorWithMessage("Data is Empty"));
    const movie = await prisma.downloadLink.createMany({
      data: downloadLinks,
    });
    res.json(successWithData(movie));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.addMovieStreamingLinks = async (req, res) => {
  try {
    const { streamingLinks } = req.body;
    if (!streamingLinks || !streamingLinks.length)
      return res.status(400).json(errorWithMessage("Data is Empty"));
    const movie = await prisma.streamingLink.createMany({
      data: streamingLinks,
    });
    res.json(successWithData(movie));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};

exports.getMovieLinks = async (req, res) => {
  try {
    const { tmdbId, imdbId, id } = req.query;
    if (!tmdbId && !imdbId && !id)
      return res.status(400).json(errorWithMessage("Invalid Parameters"));
    const downloadLinks = await prisma.downloadLink.findMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
        ...(id && { id: parseInt(id) }),
      },
    });
    const streamingLinks = await prisma.streamingLink.findMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
        ...(id && { id: parseInt(id) }),
      },
    });
    res.json(
      successWithData({
        downloadLinks: downloadLinks || [],
        streamingLinks: streamingLinks || [],
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
