'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const queryParser = require('./queryParser');
/* Import Google Books API Key */
const apiKey = require('../gBooks_api_key.json');

const app = express()
const PORT = 8000

// adding Helmet to enhance API's security
app.use(helmet());
// enabling CORS for all requests
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// defining an endpoint to return data
/* implement your gbooks functionality and route(s) here! */
app.get('/', async (request, response) => {

    const query = request.query.q;
    
    /* Offset results by N for repeat queries */
    let offset = 0; // Default value
    if (request.query.offset) {
        offset = request.query.offset;
    } else {
        console.log('using default offset value');
    }

    console.log('query', query);
    console.log('offset', offset);

    // get search results
    try {
        const result = await queryParser.getGBooksResults(query, offset, apiKey.BooksAPIkey);
        if (result) {
            response.json(result);
        } else {
            response.json({ 'Error': 'result undefined' });
        }
    }
    catch (error) {
        console.log(error);
    }
})

/* get all rows - DEBUG */
const db = require('./dbQueries');
app.get('/getAllData', db.getAll)

// starting the server
app.listen(PORT, () => {
    console.log('listening on port:', PORT);
});