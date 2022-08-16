import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AuthService from "../_services/auth.service";
import Alert from "@material-ui/lab/Alert";
import {withRouter} from "react-router-dom";
import {LinearProgress} from "@material-ui/core";

/*function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}*/

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(0, 0, 0),
    },
    spinner: {
        margin: theme.spacing(.5, 0),
    },
}));

const Login = (props) => {
    const [compte, setCompte] = useState("");
    const [HRA, setHRA] = useState("");
    const [message, setMessage] = useState("");
    const [spinner, setSpinner] = useState(false);

    const classes = useStyles();
    const handleSubmit = (e) => {
        setSpinner(true);
        e.preventDefault();
        setMessage("");
        AuthService.login(compte, HRA).then(
            (res) => {
                if(res) {
                    if (res.response !== undefined && res.response.status === 503) {
                        setMessage("Connexion au serveur impossible");
                    } else if (res.response && res.response.badUserError) {
                        setMessage("Le nom et le numéro HRA ne correspondent pas.");
                    }
                    else {
                        localStorage.setItem('userToken', res);
                        props.stateChanger(true);
                        if (props.history.location.pathname === '/login') {
                            props.history.push('/home');
                        } else {
                            props.history.push(props.history.location.pathname);
                        }
                        window.location.reload();
                    }
                    setSpinner(false);
                }
            },
            (error) => {
                /*const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();*/
                if (error.response && error.response.status === 401) {
                    setMessage("login ou code HRA non valide");
                }

                // setLoading(false);
            }
        )
    }

    return (
        <Container component="main"
                   maxWidth="md"
                   style={{
                       paddingLeft: props.drawerWidth,
                       height: '100vh',
                       overflowY: "auto"
                   }}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Connexion
                </Typography>
                {message && (
                    <Alert
                        severity="warning"
                        style={{
                            marginTop: "1rem"
                        }}>
                        {message}
                    </Alert>
                )}

                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="compte"
                        label="Compte"
                        name="compte"
                        autoComplete="compte"
                        autoFocus
                        onChange={e => setCompte(e.target.value)}
                        value={compte}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="hra"
                        label="Numéro HRA"
                        type="hra"
                        id="hra"
                        autoComplete="hra"
                        onChange={e => setHRA(e.target.value)}
                        value={HRA}
                    />
                    {/*<FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />*/}
                    {spinner && (
                        <LinearProgress
                            className={classes.spinner} />
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Connexion
                    </Button>
                    {/*<Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>*/}

                </form>
            </div>
            {/*<Box mt={8}>
                <Copyright/>
            </Box>*/}
        </Container>

    );
}

export default withRouter(Login);
