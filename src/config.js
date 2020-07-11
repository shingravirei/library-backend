require('dotenv').config();

const JWT_SECRET = process.env.SECRET;
const DB_PATH = process.env.SQLITE_DEV_PATH;

module.exports = { JWT_SECRET, DB_PATH };
