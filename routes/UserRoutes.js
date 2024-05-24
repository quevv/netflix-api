const {
    addToLikeMovies,
    getAllUsers,
    getLikedMovies
} = require('../controllers/UserController');

const router = require('express').Router();

router.post("/add", (req, res) => {
    // Ensure getAllUsers has access to req and res
    addToLikeMovies(req, res);
});
router.get("/getAll", (req, res) => {
    // Ensure getAllUsers has access to req and res
    getAllUsers(req, res);
});
router.get("/getLikedMovies", (req, res) => {
    // Ensure getAllUsers has access to req and res
    getLikedMovies(req, res);
});


module.exports = router