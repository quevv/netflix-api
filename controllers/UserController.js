const express = require('express')
const User = require("../models/UserModel")
const { Pool } = require("pg");

const pool = new Pool({
    user: 'sa',
    host: 'localhost',
    database: 'netflix_clone',
    password: 'monkeyq',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
})

module.exports.addToLikedMovies = async (req, res) => {
    try {
        const { email, data } = req.body;
        // Check if user already exists in the database
        const userExistsQuery = 'SELECT * FROM "users" WHERE email = $1';
        const userExistsResult = await pool.query(userExistsQuery, [email]);

        if (userExistsResult.rows.length > 0) {
            // User already exists in the database
            const user = userExistsResult.rows[0];
            const likedMovies = user.liked_movies; // Treat null as empty array
            const alreadyLiked = likedMovies.some(movie => movie.id === data.id);

            if (alreadyLiked) {
                // Movie already in liked_movies
                return res.status(400).send({ msg: "You already added this movie to your list" });
            } else {
                // Add the movie to the liked_movies array
                const updatedMovies = [...user.liked_movies, data];
                const updateQuery = 'UPDATE "users" SET liked_movies = $1 WHERE email = $2';
                await pool.query(updateQuery, [updatedMovies, email]);
                return res.send({ msg: "Added this movie to your list successfully" });
            }
        }
        else {
            // User doesn't exist, create a new user
            const insertQuery = 'INSERT INTO "users" (email, liked_movies) VALUES ($1, $2)';
            await pool.query(insertQuery, [email, [data]]);
            return res.send({ msg: "Created new user and added movie to the list successfully" });
        }
    } catch (err) {
        return res.send({ msg: "Error adding movie" });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM "users"';
        const result = await pool.query(query);

        return res.send(result.rows);
    } catch (err) {
        return res.send({ msg: "Error fetching users" });
    }
};

module.exports.getLikedMovies = async (req, res) => {
    const { email } = req.params;
    try {
        const query = 'SELECT * FROM "users" WHERE email = $1';
        const user = (await pool.query(query, [email])).rows[0];
        if (!user) {
            res.send({ msg: "User does not exist!" })
        }
        else
            return res.send(user.liked_movies);
    } catch (err) {
        return res.send({ msg: "Error fetching users" });
    }
};

module.exports.removeFromLikedMovies = async (req, res) => {
    try {
        const { email, movieId } = req.body;
        // Check if user already exists in the database
        const userExistsQuery = 'SELECT * FROM "users" WHERE email = $1';
        const userExistsResult = await pool.query(userExistsQuery, [email]);

        if (userExistsResult.rows.length > 0) {
            // User already exists in the database
            const user = userExistsResult.rows[0];
            const likedMovies = user.liked_movies || []; // Treat null as empty array
            // Find the index of the movie with the specified ID in the likedMovies array
            const index = likedMovies.findIndex(movie => movie.id === movieId);
            if (index === -1) {
                // Movie not found in liked_movies
                return res.status(400).send({ msg: "You haven't added this movie to your list yet" });
            } else {
                // Remove the movie from the liked_movies array
                likedMovies.splice(index, 1);

                // Update the user's record in the database
                const updateQuery = 'UPDATE "users" SET liked_movies = $1 WHERE email = $2';
                await pool.query(updateQuery, [likedMovies, email]);
                return res.send({ msg: "Removed this movie from your list successfully", movies: likedMovies });
            }
        } else {
            return res.status(400).send({ msg: "User not found!" });
        }
    } catch (err) {
        return res.send({ msg: "Error deleteing liked movies" });
    }
}