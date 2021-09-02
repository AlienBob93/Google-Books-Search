const pgp = require('pg-promise')({
    /* initialization options */
    capSQL: true // capitalize all generated SQL
});
/* Get DB info */
const pool = require('../db_connection_info').pool;
const tableName = 'booklist';

/* list of table Columns */
const columns = new pgp.helpers.ColumnSet([
    'search_term',
    'og_search_timestamp',
    'gbooks_id',
    'gbooks_etag',
    'title',
    'subtitle',
    'authors',
    'volume_description',
    'categories',
    'publisher',
    'published_date',
    'volume_language',
    'print_type',
    'page_count',
    'preview_link',
    'cover_image_url'
], { table: tableName });

// Make db requests async
/* DEBUG */
const getAll = (request, response) => {
    pool.query(`SELECT * FROM ${tableName}`, (error, results) => {
        if (error) {
            throw error;
        }
        // callback
        response.status(200).json(results.rows);
    })
}

/* Check if the search term has already been performed */
const checkIfRecordExists = async (searchTerm) => {
    const query = `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE search_term =\'${searchTerm}\')`;
    try {
        const res = await pool.query(query);
        return res.rows[0].exists;
    } catch (err) {
        console.log('checkIfRecordExists Error:', err.stack);
        return err.stack;
    }
}

/* Add new search data to db */
const addSearchData = async (parsedResponse) => {
    // using pg-promise to insert multiple rows of data into the table
    const query = pgp.helpers.insert(parsedResponse, columns);
    try {
        const res = await pool.query(query);
        console.log(`addSearchData inserted: ${res.rowCount} rows`);
    } catch (err) {
        console.log('addSearchData Error:', err.stack);
    }
}

/* Get N rows from db that match the search term */
const getDatafromDB = async (searchTerm, offset) => {
    const query = `SELECT * FROM ${tableName} WHERE search_term =\'${searchTerm}\' LIMIT 10 OFFSET ${offset}`;
    try {
        const res = await pool.query(query);
        console.log(`getDatafromDB feteched: ${res.rowCount} rows`);
        // console.log('getDatafromDB res:', res.rows);
        return res.rows;
    } catch (err) {
        console.log('getDatafromDB Error:', err.stack);
        return err.stack;
    }
}

module.exports = {
    getAll,
    checkIfRecordExists,
    addSearchData,
    getDatafromDB,
}