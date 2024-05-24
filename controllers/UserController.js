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

module.exports.addToLikeMovies = async (req, res) => {
    try {
        const { email, data } = req.body;
        // Check if user already exists in the database
        const userExistsQuery = 'SELECT * FROM "user" WHERE email = $1';
        const userExistsResult = await pool.query(userExistsQuery, [email]);

        if (userExistsResult.rows.length > 0) {
            // User already exists in the database
            const user = userExistsResult.rows[0];
            const likedMovies = user.liked_movies; // Treat null as empty array
            const alreadyLiked = likedMovies.includes(parseInt(data));

            if (alreadyLiked) {
                // Movie already in liked_movies
                return res.send({ msg: "You already added this movie to your list" });
            } else {
                // Add the movie to the liked_movies array
                const updatedMovies = [...user.liked_movies, data];
                const updateQuery = 'UPDATE "user" SET liked_movies = $1 WHERE email = $2';
                await pool.query(updateQuery, [updatedMovies, email]);
                return res.send({ msg: "Added this movie to your list successfully" });
            }
        } else {
            // User doesn't exist, create a new user
            const insertQuery = 'INSERT INTO "user" (email, liked_movies) VALUES ($1, $2)';
            await pool.query(insertQuery, [email, [data]]);
            return res.send({ msg: "Created new user and added movie to the list successfully" });
        }
    } catch (err) {
        return res.send({ msg: "Error adding movie" });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM "user"';
        const result = await pool.query(query);

        return res.send(result.rows);
    } catch (err) {
        return res.send({ msg: "Error fetching users" });
    }
};

module.exports.getLikedMovies = async (req, res) => {
    const { email } = req.body;
    try {
        const query = 'SELECT * FROM "user" WHERE email = $1';
        const user = (await pool.query(query, [email])).rows[0];
        if (!user) {
            res.send({ msg: "User does not exist!" })
        }
        else
            return res.json(user.liked_movies);
    } catch (err) {
        return res.send({ msg: "Error fetching users" });
    }
};