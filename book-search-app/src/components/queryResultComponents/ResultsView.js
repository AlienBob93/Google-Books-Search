import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CollapsibleGridView from './CollapsibleGridView';
import VolumeCardView from './VolumeCardView';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    gridContainer: {
        // padding: '24px',
    },
    gridItem: {

    },
    title: {
        align: 'left',
        paddingBottom: theme.spacing(2),
    },
    titleDiv: {
        display: 'flex',
    },
    spacingDiv: {
        paddingBottom: theme.spacing(2),
    }
}));

export default function ResultsView(props) {
    const classes = useStyles();
    // Store current search results
    // Set initial state
    const [currentResults, setCurrentResults] = useState([]);
    // store results history
    const [resultsHistory, setResultsHistory] = useState([]);

    useEffect(() => {
        // update current search results
        console.log('updating current results');
        setCurrentResults(props.receivedData);

        // update results history
        if (props.resultsHistory.length > 0) {
            // console.log('props.resultsHistory', props.resultsHistory);
            console.log('Setting results history');
            setResultsHistory(props.resultsHistory);
        }

    }, [props.receivedData, props.resultsHistory]);

    /* Display previous search results in reverse chronology */
    let renderHistory;
    if (resultsHistory.length > 0) {
        // create a shallow copy to reverse history order
        let reverseResultsHistory = [...resultsHistory];
        reverseResultsHistory = reverseResultsHistory.reverse();
        // console.log('reverse array', reverseResultsHistory);
        console.log('ordered search history by reverse chronology');
        renderHistory = reverseResultsHistory.map((searchItem, index) => (
            <CollapsibleGridView results={searchItem} />
        ))
    }

    /* Display current search results */
    let renderCurrent;
    if (currentResults.length > 0) {
        console.log('showing ', currentResults.length, ' results');
        renderCurrent = <div>
            <div className={classes.titleDiv}>
                <Typography className={classes.title} component="h5" variant='h4'>
                    Showing Results for: {currentResults[0].search_term}
                </Typography>
            </div>
            <Grid container spacing={2} className={classes.gridContainer}>
                {currentResults.map((result, index) => {
                    /* 
                        Material ui Grid elemnts are placed on 12 column grid 
                        Make grid element take up all available space on small screens (keeping it centered)
                    */
                    return <Grid
                        key={index}
                        item
                        xs={12} sm={6} md={4} lg={4} xl={3}
                    >
                        <VolumeCardView result={result} />
                    </Grid>
                })}
            </Grid>
        </div>
    }

    return (
        <div className={classes.root}>
            {/* Current Results */}
            {renderCurrent}
            <div className={classes.spacingDiv}/>
            {/* Previous Results */}
            {renderHistory}
        </div>
    );
}