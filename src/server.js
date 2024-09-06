require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/AlbumsService");
const AlbumsValidator = require("./validator/albums");
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validator/songs");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const albumsService = new AlbumsService();
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  const songsService = new SongsService();
  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "error",
        message: response.message,
        stack: response.stack, // Include stack trace in the response
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  // Log errors
  server.events.on('response', (request) => {
    if (request.response.isBoom) {
      console.error(`Error response (500): ${request.response.stack}`);
    }
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
