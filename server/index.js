const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express;
app.request(cors());
const port = 3001;

app.get("/",(req, res) => {
    const pool = openDb();
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});

const openDb = () => {
    const pool = new Pool ({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'Dtlc0601*$postgresql',
        port: 5432
    });
    return pool;
}
app.listen(port);