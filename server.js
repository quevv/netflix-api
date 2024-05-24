const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const useRoutes = require("./routes/UserRoutes");
const { getAllUsers } = require("./controllers/UserController");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'sa',
    host: 'localhost',
    database: 'netflix_clone',
    password: 'monkeyq',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
})

app.use("/api/user", useRoutes);


app.listen(5000, console.log("Server started"));

module.exports = { pool };