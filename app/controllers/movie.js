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
exports.getAllMovies = async (req, res) => {
  try {
    let { page = 1, limit = 20, order = "released", query } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const count = await prisma.movie.count({
      ...(query && {
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      }),
    });
    const total_pages = Math.ceil(count / limit);
    const movies = await prisma.movie.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      skip: page > 1 ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        ...(order == "created"
          ? { createdAt: "desc" }
          : { releaseDate: "desc" }),
      },
      ...(query && {
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              imdbId: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              ...(!isNaN(query)
                ? {
                    tmdbId: {
                      equals: parseInt(query),
                    },
                  }
                : null),
            },
          ],
        },
      }),
      // take: limit,
    });
    if (!movies)
      return res.status(404).json(errorWithMessage("Movie Not Found!"));

    const finalMovies = movies.map((movie) => ({
      ...movie,
      genres: movie.genres.map((genres) => genres.genre?.name),
    }));

    res.json(
      successWithData({
        total_pages: total_pages,
        page: page,
        total_results: count,
        results: finalMovies,
      })
    );
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
    let { downloadLinks, imdbId, tmdbId } = req.body;
    if (!imdbId && !tmdbId)
      return res.status(400).json(errorWithMessage("Data is Empty"));
    if (!downloadLinks)
      return res.status(400).json(errorWithMessage("Data is Empty"));

    downloadLinks = downloadLinks.length
      ? downloadLinks.map((e) => {
          return {
            tmdbId: tmdbId,
            imdbId: imdbId,
            provider: e.provider || "Unknown",
            link: e.link,
            resolution: e.resolution ? parseInt(e.resolution) : null,
            size: e.size ? parseInt(e.size) : null,
          };
        })
      : downloadLinks;

    const deleteMovieLinks = prisma.downloadLink.deleteMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
      },
    });
    const addMovieLinks = prisma.downloadLink.createMany({
      data: downloadLinks,
    });

    const createLink = await prisma.$transaction([
      deleteMovieLinks,
      ...(downloadLinks.length ? [addMovieLinks] : []),
    ]);

    res.json(successWithData(createLink));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.addMovieStreamingLinks = async (req, res) => {
  try {
    let { streamingLinks, imdbId, tmdbId } = req.body;
    if (!imdbId && !tmdbId)
      return res.status(400).json(errorWithMessage("Data is Empty"));
    if (!streamingLinks)
      return res.status(400).json(errorWithMessage("Data is Empty"));

    streamingLinks = streamingLinks.length
      ? streamingLinks.map((e) => {
          return {
            tmdbId: tmdbId,
            imdbId: imdbId,
            provider: e.provider || "Unknown",
            link: e.link,
            resolution: e.resolution ? parseInt(e.resolution) : null,
            size: e.size ? parseInt(e.size) : null,
          };
        })
      : streamingLinks;

    const deleteMovieLinks = prisma.streamingLink.deleteMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
      },
    });
    const addMovieLinks = prisma.streamingLink.createMany({
      data: streamingLinks,
    });

    const createLink = await prisma.$transaction([
      deleteMovieLinks,
      ...(streamingLinks.length ? [addMovieLinks] : []),
    ]);

    res.json(successWithData(createLink));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.addMovieSubtitlesLinks = async (req, res) => {
  try {
    let { subtitleLinks, imdbId, tmdbId } = req.body;
    if (!imdbId && !tmdbId)
      return res.status(400).json(errorWithMessage("Data is Empty"));
    if (!subtitleLinks)
      return res.status(400).json(errorWithMessage("Data is Empty"));

    subtitleLinks = subtitleLinks.length
      ? subtitleLinks.map((e) => {
          return {
            tmdbId: tmdbId,
            imdbId: imdbId,
            language: e.language,
            link: e.link,
          };
        })
      : subtitleLinks;

    const deleteSubtitleLinks = prisma.subtitleLink.deleteMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
      },
    });
    const addSubtitleLinks = prisma.subtitleLink.createMany({
      data: subtitleLinks,
    });

    const createLink = await prisma.$transaction([
      deleteSubtitleLinks,
      ...(subtitleLinks.length ? [addSubtitleLinks] : []),
    ]);

    res.json(successWithData(createLink));
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
exports.getMovieSubtitles = async (req, res) => {
  try {
    const { tmdbId, imdbId } = req.query;
    if (!tmdbId && !imdbId)
      return res.status(400).json(errorWithMessage("Invalid Parameters"));
    const subtitles = await prisma.subtitleLink.findMany({
      where: {
        ...(tmdbId && { tmdbId: parseInt(tmdbId) }),
        ...(imdbId && { imdbId: imdbId }),
      },
    });
    res.json(
      successWithData({
        subtitles: subtitles || [],
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
exports.deleteMovieByid = async (req, res) => {
  try {
    const { id } = req.params;
    const genres = prisma.genresOnMovies.deleteMany({
      where: {
        movieId: movieId,
      },
    });
    const streamingLinks = prisma.streamingLink.deleteMany({
      where: {
        movie: {
          id: movieId,
        },
      },
    });
    const downloadLink = prisma.downloadLink.deleteMany({
      where: {
        movie: {
          id: movieId,
        },
      },
    });
    const deleteMovie = prisma.movie.delete({
      where: {
        id: movieId,
      },
    });
    await prisma.$transaction([
      genres,
      streamingLinks,
      downloadLink,
      deleteMovie,
    ]);
    res.json(
      successWithData({
        movieId: id,
        message: "Movie Deleted Successfully",
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorWithMessage(error.message));
  }
};
