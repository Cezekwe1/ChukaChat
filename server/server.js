var express = require("express");
var app = express();
var api = require("./api");
var auth = require("../server/auth/routes");
var path = require("path");
require("./middleware/appMiddleware")(app);

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/api/", api);
app.use("/auth/", auth);
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token");
    return;
  }
  if (err.code === 11000) {
    res.status(400).send("Username already exists!");
  }

  res.status(500).send("Oops");
});

module.exports = app;
