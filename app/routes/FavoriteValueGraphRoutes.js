module.exports = (app) => {
  const FavoriteValueGraphController = require("../controllers/FavoriteValueGraphController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.get(
    "/user-favorites-graph",
    auth(),
    FavoriteValueGraphController.userFavoritesGraph
  );

  app.use("/", router);
};
