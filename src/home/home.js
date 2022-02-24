import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";

const Home = (props) => {
    const useStyles = makeStyles(theme => {
        createStyles({
            root: {
                width: '100%',
            },
            content: {
                padding: theme.spacing(3),
            },
        })
    });

    const classes = useStyles();

    return (
        <div className={classes.root} style={{paddingLeft: props.drawerWidth}}>
        </div>
    );
};
export default Home;


