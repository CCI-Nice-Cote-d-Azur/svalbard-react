import React, {useEffect} from 'react';
import {withRouter} from "react-router-dom";
import AuthService from "../_services/auth.service";
import Container from '@material-ui/core/Container';


const Logout = (props) => {

    useEffect(() => {
        AuthService.logout();
        props.stateChanger(false);
        props.history.push('/login');
    });

    return (
        <Container>
            <div>
                <p>Déconnexion en cours...</p>
            </div>
        </Container>
    )
}

export default withRouter(Logout);
