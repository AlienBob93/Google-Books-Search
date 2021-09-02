import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, InputBase } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        color: "default",
        /* #6E991F -> DocNetwork Green */
        background: '#6E991F',
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
        textAlign: "left",
        textDecoration: 'none',
        color: grey[100]
    },
    toolbar: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            minWidth: 568,
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        // Responsive layout for input text
        [theme.breakpoints.up('sm')]: {
            minWidth: 500,
            '&:focus': {
                width: '20ch',
            },
        },
        [theme.breakpoints.up('md')]: {
            '&:focus': {
                width: '40ch',
            },
        },
        [theme.breakpoints.up('lg')]: {
            '&:focus': {
                width: '55ch',
            },
        },
    },
}));

export default function SearchAppBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search Books…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={(event) => {
                                // search only when enter is pressed
                                if (event.key === 'Enter') {
                                    props.onSearch(event);
                                }
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
