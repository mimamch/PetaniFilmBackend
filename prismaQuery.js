const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createGenre = async () => {
  await prisma.genre.createMany({
    data: [
      {
        tmdbGenreId: 28,
        name: "Action",
      },
      {
        tmdbGenreId: 12,
        name: "Adventure",
      },
      {
        tmdbGenreId: 16,
        name: "Animation",
      },
      {
        tmdbGenreId: 35,
        name: "Comedy",
      },
      {
        tmdbGenreId: 80,
        name: "Crime",
      },
      {
        tmdbGenreId: 99,
        name: "Documentary",
      },
      {
        tmdbGenreId: 18,
        name: "Drama",
      },
      {
        tmdbGenreId: 10751,
        name: "Family",
      },
      {
        tmdbGenreId: 14,
        name: "Fantasy",
      },
      {
        tmdbGenreId: 36,
        name: "History",
      },
      {
        tmdbGenreId: 27,
        name: "Horror",
      },
      {
        tmdbGenreId: 10402,
        name: "Music",
      },
      {
        tmdbGenreId: 9648,
        name: "Mystery",
      },
      {
        tmdbGenreId: 10749,
        name: "Romance",
      },
      {
        tmdbGenreId: 878,
        name: "Science Fiction",
      },
      {
        tmdbGenreId: 10770,
        name: "TV Movie",
      },
      {
        tmdbGenreId: 53,
        name: "Thriller",
      },
      {
        tmdbGenreId: 10752,
        name: "War",
      },
      {
        tmdbGenreId: 37,
        name: "Western",
      },
    ],
  });
};

const createMovie = async () => {
  console.log(
    await prisma.movie.create({
      data: {
        adult: false,
        tmdbBackdropPath: "/lv4mA4jOnRSQCkmDYUyZ8ON43Dc.jpg",
        budget: 250000000,
        genres: {
          create: [
            {
              assignedAt: new Date(),
              genre: {
                connect: {
                  tmdbGenreId: 10751,
                },
              },
            },
            {
              assignedAt: new Date(),
              genre: {
                connect: {
                  tmdbGenreId: 10749,
                },
              },
            },
            {
              assignedAt: new Date(),
              genre: {
                connect: {
                  tmdbGenreId: 10770,
                },
              },
            },
            {
              assignedAt: new Date(),
              genre: {
                connect: {
                  tmdbGenreId: 36,
                },
              },
            },
          ],
        },
        tmdbId: 532639,
        imdbId: "tt4593060",
        originalLanguage: "en",
        originalTitle: "Pinocchio",
        overview:
          "A wooden puppet embarks on a thrilling adventure to become a real boy.",
        popularity: 1877.708,
        tmdbPosterPath: "/g8sclIV4gj1TZqUpnL82hKOTK3B.jpg",
        releaseDate: "2022-09-07",
        revenue: 755000000,
        runtime: 119,
        status: "Released",
        tagline: "The one is not the only.",
        title: "Thor: Love and Thunder",
        video: false,
        voteAverage: 6.814,
        voteCount: 3108,
      },
    })
  );
};

const getAllMovies = async () => {
  const movies = await prisma.movie.findMany({
    where: {
      genres: {
        some: {
          genre: {
            name: "Action",
          },
        },
      },
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
  const movie = movies.map((e) => {
    return { ...e, genres: e.genres.map((genres) => genres.genre?.name) };
  });
  console.log(movie);
  return movie;
};

const deleteMovie = async () => {
  try {
    // const deleteRelation = await prisma.labelplaylist.delete({
    //   where: {
    //     playlistId_labelId: {
    //       playlistId: playListIdVariable, //replace with appropriate variable
    //       labelId: labelIdVariable, //replace with appropriate variable
    //     },
    //   },
    // });
    // const updatePost = await prisma.user.update({
    //     where: {
    //       id: 16,
    //     },
    //     data: {
    //       posts: {
    //         disconnect: [{ id: 12 }, { id: 19 }],
    //       },
    //     },
    //     select: {
    //       posts: true,
    //     },
    //   })
    const deleted = prisma.genresOnMovies.deleteMany({
      where: {
        movieId: 1,
      },
    });
    const deleteMovie = prisma.movie.delete({
      where: {
        id: 1,
      },
    });
    await prisma.$transaction([deleted, deleteMovie]);
    // console.log(deleted);
  } catch (error) {
    console.log(error);
  }
};

// getAllMovies();
// deleteMovie();
createMovie();
