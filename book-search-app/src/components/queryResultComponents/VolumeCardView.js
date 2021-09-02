import React from 'react';
import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import { Typography, Hidden } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { fontTheme } from '../MUITheme';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%',
    },
    cover: {
        maxWidth: 151,
        maxHeight: 300,
    },
    description: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
}));

export default function VolumeCardView(props) {
    const classes = useStyles();
    const theme = useTheme();

    /* Breakpoints for a more responsive app */
    const hideDescription = useMediaQuery(theme.breakpoints.between(600, 700));
    const showReducedDescription = useMediaQuery(theme.breakpoints.between(700, 750));

    /* truncate long strings */
    const truncate = (input) => input.length > 27 ? `${input.substring(0, 27)}...` : input;

    /* Handle NUll values */
    const title = props.result.title ? `${truncate(props.result.title)}` : '';
    /* set default image? */
    const coverImgURL = props.result.cover_image_url ? props.result.cover_image_url : '';
    const previewLink = props.result.preview_link ? props.result.preview_link : '';
    const subtitle = props.result.subtitle ? `${truncate(props.result.subtitle)}` : '';
    const authors = props.result.authors ? props.result.authors.join(', ') : 'n/a';
    // const categories = props.result.categories ? `[ ${props.result.categories.join(', ')} ]` : '';
    /* Just get the published year */
    const publishedDate = props.result.published_date ? props.result.published_date.substring(0, 4) : 'date unknown';
    /*  
        Hide description when window width < 700 && width > 600
        When width < 600 show only the 1st line for description 
    */
    let description = props.result.volume_description ? `${props.result.volume_description.substring(0, 98)}...` : '';

    /* For responsiveness */
    let renderDescription;
    if (description) {
        if (hideDescription) {
            console.log('hiding descriptions');
            description = '';
        } else if (showReducedDescription) {
            console.log('showing small small descriptions');
            description = `${description.substring(0, 10)}...`;
        }
        /* render the volume description */
        renderDescription = <div className={classes.description}>
            <ThemeProvider theme={fontTheme}>
                <Typography noWarp align='left' variant='caption'>
                    {description}
                </Typography>
            </ThemeProvider>
        </div>;
    }

    return (
        <Card className={classes.root}>
            {/* Making the card clickable -> link to volume preview link */}
            <CardActionArea className={classes.root} target="_blank" href={previewLink}>
                <div className={classes.details}>
                    {/* Book/Volume Details */}
                    <CardContent className={classes.content}>
                        <ThemeProvider theme={fontTheme}>
                            {/* Volume title */}
                            <Typography align='left' component="h6" variant="h6">
                                {title}
                            </Typography>
                            {/* Volume subtitle */}
                            <Typography align='left' variant="subtitle1" color="textSecondary">
                                {subtitle}
                            </Typography>
                            {/* Volume authors */}
                            <Typography align='left' variant="subtitle2">
                                {authors}
                            </Typography>
                            {/* Volume published date */}
                            <Typography align='left' variant="subtitle2">
                                {publishedDate}
                            </Typography>
                        </ThemeProvider>
                    </CardContent>
                    {/* Volume description */}
                    {renderDescription}
                </div>
                {/* Book Thumbnail */}
                <CardMedia
                    className={classes.cover}
                    component="img"
                    src={coverImgURL}
                    title={props.result.title}
                />
            </CardActionArea>
        </Card>
    );
}