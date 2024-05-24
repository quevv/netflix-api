const {
    getLikedMovies,
    addToLikedMovies,
    removeFromLikedMovies
} = require('../controllers/UserController');

const router = require('express').Router();

router.get("/liked/:email", getLikedMovies);
router.post("/add", addToLikedMovies);
router.put("/remove", removeFromLikedMovies);


module.exports = router