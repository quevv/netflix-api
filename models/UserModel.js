class User {
    constructor(user_id, email, liked_movies) {
        this.user_id = user_id;
        this.email = email;
        this.liked_movies = liked_movies;
    }
}

module.exports = { User }