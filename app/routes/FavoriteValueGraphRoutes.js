module.exports = (app) => {
  const FavoriteValueGraphController = require("../controllers/FavoriteValueGraphController");

  var router = require("express").Router();
  router.get(
    "/user-favorites-graph",
    auth(),
    FavoriteValueGraphController.userFavoritesGraph
  );

  app.use("/", router);
};
