// Task 6 ./helpers/db.js

require('dotenv').config();
const { Pool } = require('pg');

const openDb = () => {
    const pool = new Pool ({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });
    return pool;
};

const query = async(sql, values = []) => {
        try {
            const pool = openDb();
            const result = await pool.query(sql, values);
            return result;
        } catch(error) {
            throw new Error(error.message);
        }
};

module.exports = { query }
