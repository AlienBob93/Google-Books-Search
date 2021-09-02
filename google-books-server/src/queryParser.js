const axios = require('axios');
const db = require('./dbQueries');

const googleBooksBaseURI = 'https://www.googleapis.com/books/v1/volumes';

const getGBooksResults = async (searchTerm, offset, API_Key) => {
    /* 
        gBooks API max number of results must be in range 0 - 40 -> Default is 10
        to get the next (N) results use start-index to get next set of results (Pagination)
        Only getting maxResults number of search results - No proper pagination support from gbooks API
        for this iteration
    */
    const maxResults = 40;
    const searchURL = `${googleBooksBaseURI}?q=${searchTerm}&key=${API_Key}&maxResults=${maxResults}`;//&start-index={nextResultIndex}`;
    /* Get timestamp of when query is received */
    const searchTimeStamp = new Date().toISOString();

    /* Check if search term exists in DB */
    try {
        const result = await db.checkIfRecordExists(searchTerm);
        console.log('search has already been performed:', result);

        /* 
            If data doesnt exist in db search gBooks 
            else get data from db
        */
        if (result) {
            /* 
                fetch data from db 
                Offset results to return a new set of results for each search
            */
            const rows = await db.getDatafromDB(searchTerm, offset);
            return rows;
        } else {
            /* Get search results from gBooks api */
            const searchResponse = await axios.get(searchURL)
                .then((response) => {
                    return response;
                }).catch(err => {
                    console.log(err);
                });
            /* Parse response */
            const parsedResponse = parseSearchResults(searchTerm, searchTimeStamp, searchResponse);
            /* Add search results from the gBooks api call to db */
            await db.addSearchData(parsedResponse);
            
            /* Only return the 1st 10 responses */
            const returnResponse = parsedResponse.slice(0, 10);
            return returnResponse;
        }

    } catch (err) {
        console.log(err);
    }
}

/* Parse gBooks API response */
const parseSearchResults = (searchTerm, searchTimeStamp, searchResponse) => {
    const resultsObj = searchResponse.data;
    // console.log('ResultsObj', resultsObj);
    const parsedResults = resultsObj.items.map((volume, index) => {
        let volumeObj = new Object();
        /* get volume info */
        volumeObj.search_term = searchTerm;
        volumeObj.og_search_timestamp = searchTimeStamp;
        volumeObj.gbooks_id = volume.id;
        volumeObj.gbooks_etag = volume.etag;
        volumeObj.title = volume.volumeInfo.title;
        // set undefined fields as null
        volumeObj.subtitle = volume.volumeInfo.subtitle ? volume.volumeInfo.subtitle : null;
        volumeObj.authors = volume.volumeInfo.authors ? volume.volumeInfo.authors : null
        // Limit volume description to 140 characters
        volumeObj.volume_description = volume.volumeInfo.description ? volume.volumeInfo.description.substring(0, 140) : null;
        volumeObj.categories = volume.volumeInfo.categories ? volume.volumeInfo.categories : null
        volumeObj.publisher = volume.volumeInfo.publisher ? volume.volumeInfo.publisher : null;
        volumeObj.published_date = volume.volumeInfo.publishedDate ? volume.volumeInfo.publishedDate : null;
        volumeObj.volume_language = volume.volumeInfo.language ? volume.volumeInfo.language : null;
        volumeObj.print_type = volume.volumeInfo.printType ? volume.volumeInfo.printType : null;
        volumeObj.page_count = volume.volumeInfo.pageCount ? volume.volumeInfo.pageCount : null;
        volumeObj.preview_link = volume.volumeInfo.previewLink ? volume.volumeInfo.previewLink : null;
        volumeObj.cover_image_url = volume.volumeInfo.imageLinks ? volume.volumeInfo.imageLinks.thumbnail : null;

        // console.log('collected volume Info: ', index, volumeObj);
        return volumeObj;
    });
    console.log(`parsed ${parsedResults.length} entries`);
    console.log('parsedResults', parsedResults);
    /* Find and remove duplicates - Not necessary */
    /* const ids = parsedResults.map(o => o.gbooks_id)
    const filtered = parsedResults.filter(({ id }, index) => !ids.includes(id, index + 1))
    console.log('removed duplicates comparing gBooks_id');
    console.log('filtered obj', filtered.length); */
    return parsedResults;
}

module.exports = {
    getGBooksResults,
}