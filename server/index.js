const express = require("express");
const { Client } = require("pg");

const cors = require('cors');
const app = express()

app.use(cors());

const client = new Client({
    host: "localhost",
    user: 'postgres',
    password: 'password',
    database: 'postgres',
    port: 5432
});

client.connect();

app.get("/api", (req, res) => {
    client.query("SELECT * FROM customer", (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
});
