import '@fontsource/roboto';
import './app.css';
import React, {useEffect, useState} from 'react';
import Archives from "./archives/archives";
import {
    createStyles,
    Divider,
    Drawer, FormControlLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles, useMediaQuery
} from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {
    HashRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
import MaterialSwitch from "@material-ui/core/Switch"
import Home from "./home/home";
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccessRefused from "./access-denied/access-refused";
import AddArchive from "./add-archive/add-archive";
import Login from "./login/login";
import DashboardUser from "./dashboard-user/dashboard-user";
import axios from "axios";
import DashboardArchiviste from "./dashboard-archiviste/dashboard-archiviste";
import createTheme from "@material-ui/core/styles/createTheme";
import Logout from "./logout/logout";
require('dotenv').config();

const App = () => {

    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const API_URL = process.env.REACT_APP_API_URL;

    const [darkMode, setDarkMode] = useState([prefersDarkMode]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isArchiviste, setIsArchiviste] = useState(false);

    useEffect(() => {
        const userHRA = localStorage.getItem('userHRA');
        const token = localStorage.getItem('userToken');
        if(token){
            setIsAuthenticated(true);
            axios
                .get(API_URL + 'users/hra/' + userHRA, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(res => {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    let isArchivisteOrNot = setIsArchiviste(res.data['archiviste']);
                    if (res.data["archiviste"]) {
                        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                            isArchivisteOrNot = setIsArchiviste(process.env.REACT_APP_IS_ARCHIVISTE);
                        } else {
                        }
                    }
                    return isArchivisteOrNot;
                }).catch(() => {

            });
        } else {
            setIsAuthenticated(false);
        }

    }, [API_URL]);



    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    type: darkMode ? 'dark' : 'light',
                },
            }),
        [darkMode],
    );

    /*
        Ajouter ou supprimer des objets pour remplir la barre de navigation gauche
     */

    const drawerContent = [
        {
            text: 'Accueil',
            icon: <HomeIcon />,
            url: '/home'
        },
        {
            text: 'Consulter les archives',
            icon: <VisibilityIcon />,
            url: '/archive'
        },
        {
            text: 'Verser une ou plusieurs archives',
            icon: <AddBoxIcon />,
            url: '/ajouter-archive'
        },
        ];

    const monEspace = [
        isArchiviste ?
        {
            text: 'Demandes utilisateurs',
            icon: <DashboardIcon />,
            url: '/demandes-archivage'
        }
        :
        {
            text: 'Mes demandes',
            icon: <DashboardIcon />,
            url: '/mes-demandes'
        }
    ];

    // En cas de modif, il faut aussi modifier .MuiDrawer-paperAnchorLeft dans le CSS de archive.css
    const drawerWidth = 270;

    const useStyles = makeStyles(theme => {
        createStyles({
            root: {
                display: 'flex'
            },
            drawer: {
                width: drawerWidth,
                flexShrink: 0
            },
            listText: {
                textAlign: "center"
            },
            drawerPaper: {
                width: drawerWidth
            },
            content: {
                flexGrow: 1,
                padding: theme.spacing(3),
            }
        })
    });

    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent) => {
        if (prefersDarkMode) {
            setDarkMode(event.target.checked);
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
            <div className={classes.root}>
                <Drawer variant={"permanent"}
                        anchor={"left"}
                        className={classes.drawer}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        id="drawer"
                        style={{width: drawerWidth }}>
                    <div className={classes.toolbar} />
                    <Divider/>
                    <List>
                        <ListSubheader component="div" id="list-subheader">
                            LOGO
                        </ListSubheader>
                        <Divider />
                        {drawerContent.map((content) => (
                            <ListItem button key={content.text} component={Link} to={content.url}>
                                <ListItemIcon>{ content.icon }</ListItemIcon>
                                <ListItemText primary={content.text} className={"list-item"} />
                            </ListItem>
                        ))}
                        <Divider />
                        {isAuthenticated ? (
                        <List>
                            <ListSubheader component="div" id="nested-list-subheader">
                                Mon espace
                            </ListSubheader>
                            {monEspace.map((content) => (
                                <ListItem button key={content.text} component={Link} to={content.url}>
                                    <ListItemIcon>{ content.icon }</ListItemIcon>
                                    <ListItemText primary={content.text} className={"list-item"} />
                                </ListItem>
                            ))}
                        </List>
                        ) : false }
                        <Divider />
                        {!isAuthenticated ? (
                        <ListItem button key={"Se connecter"} component={Link} to={"/login"}>
                            <ListItemIcon>{ <VpnKeyIcon /> }</ListItemIcon>
                            <ListItemText primary={"Se connecter"} className={"list-item"} />
                        </ListItem>
                        ) : (
                        <ListItem button key={"Se déconnecter"} component={Link} to={"/logout"}>
                            <ListItemIcon>{ <MeetingRoomIcon /> }</ListItemIcon>
                            <ListItemText primary={"Se déconnecter"} className={"list-item"} />
                        </ListItem>
                            )}
                        <Divider />
                        <FormControlLabel
                            value={ darkMode }
                            control={
                                <MaterialSwitch
                                color="primary"
                                checked={darkMode}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onClick={handleChange}
                                />
                            }
                            label={ darkMode ? "Activer mode lumineux" : "Activer mode sombre"}
                            labelPlacement="start"
                        />
                    </List>
                </Drawer>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

                {/*Ajouter la <Route> correspondant à l'élément du Drawer gauche */}
                <Switch>
                    <Route exact path={"/archive"}>
                        {isAuthenticated ? (
                            <Archives drawerWidth={drawerWidth} isArchiviste={isArchiviste} darkModeEnabled={prefersDarkMode} />
                        ) : (
                            <Login stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                        )}
                    </Route>
                    <Route exact path={"/ajouter-archive"}>
                        {isAuthenticated ? (
                            <AddArchive drawerWidth={drawerWidth} />
                        ) : (
                            <Login stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                        )}
                    </Route>
                    <Route exact path={"/login"}>
                        {isAuthenticated ? (
                            <Home drawerWidth={drawerWidth} />
                        ) : (
                            <Login stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                        )}
                    </Route>
                    <Route exact path={"/logout"}>
                        <Logout stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                    </Route>
                    {isArchiviste ? (
                        <Route exact path={"/demandes-archivage"}>
                            {isAuthenticated ? (
                                <DashboardArchiviste drawerWidth={drawerWidth} darkModeEnabled={prefersDarkMode} />
                            ) : (
                                <Login stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                            )}
                        </Route>
                    ) : (
                        <Route exact path={"/mes-demandes"}>
                            {isAuthenticated ? (
                                <DashboardUser drawerWidth={drawerWidth} darkModeEnabled={prefersDarkMode} />
                            ) : (
                                <Login stateChanger={setIsAuthenticated} drawerWidth={drawerWidth} />
                            )}
                        </Route>
                    )}
                    <Route exact path={"/home"}>
                        <Home drawerWidth={drawerWidth} />
                    </Route>
                    <Route path="">

                    </Route>
                    <Route path="/">
                        <Home drawerWidth={drawerWidth} />
                    </Route>
                    <Route path={"/access-refused"}>
                        <AccessRefused drawerWidth={drawerWidth} />
                    </Route>
                </Switch>
            </div>
        </HashRouter>
        </ThemeProvider>
    );
}
export default App;
