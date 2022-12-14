var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const { normalizePort } = require("./bin/www");
const { onError } = require("./bin/www");
const { onListening } = require("./bin/www");
const http = require("http");
var app = express();
// const movieRouter = require("./app/routes/movie");

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/movie", movieRouter);
app.use("/v2", require("./v2/routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
var server = http.createServer(app);
server.listen(port);
server.on("error", (err) => onError(err, port));
server.on("listening", () => onListening(server));
