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
    
    return res.status(401).send("Invalid token");
  }
  if (err.code === 11000) {
    
    return res.status(200).send("Username already exists!");
  }

  return res.status(200).send("Oops");
});

module.exports = app;
