module.exports = (app) => {
    const favoriteController = require('../controllers/FavoriteController');
    // const validationController = require('../controllers/ValidationController')
    var router = require('express').Router();
    router.get('/user-favorites-list', [ favoriteController.userFavorites]);
    router.post('/add-user-favorites', [ favoriteController.addFavorites]);
    //router.post('/edit-user-favorites-list', [ favoriteController.editFavoritesList]);
    
    app.use('/', router);
};
