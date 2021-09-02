import React, { useState, useEffect } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Typography, CircularProgress } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import axios from 'axios';
import ResultsView from '../components/queryResultComponents/ResultsView';
import SearchAppBar from '../components/appBar/SearchAppBar';
import { fontTheme } from '../components/MUITheme';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: grey[300],
    },
    content: {
        maxWidth: '1500px',
        padding: theme.spacing(2),
    },
    defaultMessage: {

    },
}));

export default function SearchPage() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [receivedData, setReceivedData] = useState();
    // maintain results history state
    const [searchHistory, setSearchHistory] = useState([]);
    const [resultsHistory, setResultsHistory] = useState([]);
    /* 
        Component to be rendered
        Default message - Prompt user to action 
    */
    let rendered = <div className={classes.defaultMessage}>
        <ThemeProvider theme={fontTheme}>
            <Typography variant='h4' color='textSecondary'>
                Search for books, by title, authors, etc...
            </Typography>
        </ThemeProvider>
    </div>;

    // GoogleBooks Server API URL
    const baseGBooksURL = 'http://localhost:8000/';
    // Default search offset value
    const [resultsOffset, setResultsOffset] = useState(0);

    /* count the occurances of a value in an array */
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

    useEffect(() => {
        // start loading
        setLoading(true);

        /* fetch data from the books API */
        // only search if there's a valid query
        if (searchQuery) {
            // Maintain search history
            if (receivedData) {
                console.log('prev search', searchHistory);
                setResultsHistory([...resultsHistory, receivedData]);
                /* Limit no of history items?? */
                if (resultsHistory.length >= 20) {
                    console.log('Limiting results history to 20');
                    /* Truncate history array */
                }
            }
            /* 
                API get
                receives 10 results per search
            */
            const searchURL = `${baseGBooksURL}?q=${searchQuery}&offset=${resultsOffset}`;
            axios.get(searchURL)
                .then(res => {
                    // console.log(res.data); 
                    console.log('fetched data');
                    setReceivedData(res.data);
                    /* finish loading */
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setErr(err);
                    /* finish loading */
                    setLoading(false);
                })
        }
    }, [searchQuery]);

    /* Search -> set search terms and options */
    const onSearch = (event) => {
        const query = event.target.value;
        // only search if there's a valid query
        if (query) {
            // keep searchTerm History
            if (searchQuery) {
                // console.log('prev searchTerm', searchQuery);
                /* Limit no of history items?? */
                /* 
                    logic to show different results if the previous search term is used 
                    Offset results by 10 for each repeat searc term
                */
                let offsetMultiplier = countOccurrences(searchHistory, query);
                if (offsetMultiplier > 0) {
                    console.log('Search has alrady been performed, fetching new results');
                    console.log('Offsetting results by', offsetMultiplier);
                    /* 
                        Only 40 total results are stored in the db per search term
                        rolling over if offsetMultiplier excedes 4
                    */
                    if (offsetMultiplier > 4) {
                        offsetMultiplier = offsetMultiplier % 4;
                    }
                    setResultsOffset(10 * offsetMultiplier);
                }
                setSearchHistory([...searchHistory, searchQuery]);
            }
            setSearchQuery(query);
            console.log('Searching: ', query);
        }
    };

    /* Error handling */
    if (err && !loading) {
        console.log("Error", err);
        /* Error while searching */
        rendered = <div className={classes.defaultMessage}>
            <ThemeProvider theme={fontTheme}>
                <Typography variant='h4' color='textSecondary'>
                    Error Performing Search
                </Typography>
            </ThemeProvider>
        </div>;
    }

    /* Render results if valid data is received */
    if (!loading && receivedData.length > 0) {
        // console.log('receivedData', receivedData);
        console.log('resultsHistory', resultsHistory);
        rendered = <ResultsView receivedData={receivedData} resultsHistory={resultsHistory} />
    } else {
        /* When loading show progress bar */
        if (loading && searchQuery) {
            console.log('Loading...');
            rendered = <CircularProgress />;
        }
    }

    return (
        <div>
            <SearchAppBar onSearch={onSearch} />
            <div className={classes.root}>
                <div className={classes.content}>
                    {/* Show results after data has been received */}
                    {rendered}
                </div>
            </div>
        </div>
    );
}