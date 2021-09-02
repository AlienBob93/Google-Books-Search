/* PostgressSQL DB connection details */
const { Pool } = require('pg');
const pool = new Pool({
    user: 'DB USERNAME GOES HERE',
    /* for development purposes */
    host: 'localhost',
    database: 'DB NAME GOES HERE',
    password: 'DB USER PASSWORD GOES HERE',
    /* Default port change accordingly */
    port: 5432,
})

module.exports = {
    pool,
}