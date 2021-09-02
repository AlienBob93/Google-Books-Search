import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Paper, IconButton, Collapse, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VolumeCardView from './VolumeCardView';
import { fontTheme } from '../MUITheme';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        paddingTop: theme.spacing(2),
    },
    collapsibleBarTitle: {
        paddingLeft: theme.spacing(2),
    },
    collapsibleBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

export default function CollapsibleGridView(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    // Store search results
    const [resultsList, setResults] = useState([]);

    useEffect(() => {
        // Sanity check
        if (props.results.length > 0) {
            setResults(props.results);
        }
    }, [props.results]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    /* Display current search results */
    let renderResults;
    if (resultsList.length > 0) {
        renderResults = <div className={classes.container}>
            {/* making the collapsible bar clickable for an intuitive UX */}
            <Paper className={classes.collapsibleBar} onClick={handleExpandClick}>
                <ThemeProvider theme={fontTheme}>
                    <Typography variant='h6' className={classes.collapsibleBarTitle}>
                        Showing Results for: {resultsList[0].search_term}
                    </Typography>
                </ThemeProvider>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Paper>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Grid container spacing={2}>
                    {resultsList.map((result, index) => (
                        /* 
                            Material ui Grid elemnts are placed on 12 column grid 
                            Make grid element take up all available space on small screens (keeping it centered)
                        */
                        <Grid
                            key={index}
                            item xs={12}
                            sm={6} md={4} lg={4} xl={3}
                        >
                            <VolumeCardView result={result} />
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </div>
    }

    return (
        <div className={classes.root}>
            {renderResults}
        </div>
    );
}