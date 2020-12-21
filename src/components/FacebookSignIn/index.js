import React, {Fragment, useState} from 'react';
import FacebookLogin from 'react-facebook-login';
import {useHistory} from "react-router";
import BackendError from "../BackendError";
import {loginFacebook} from "../../utils/requests";

export default function FacebookSignIn({setLoader}){
    const history = useHistory();
    const [backendError, setBackendError] = useState(null);
    const goHome = () => history.push('/auth/dashboard');
    const responseFacebook = (response) => {
       const {accessToken, userID} = response;
        loginFacebook({accessToken: accessToken, userId: userID},setLoader,setBackendError, goHome)
    };
    return <Fragment>
        {backendError && <BackendError error={backendError}/> }
        <FacebookLogin
        appId="463764117935801"
        autoLoad={false}
        fields="name,email,picture"
        size="metro"
        icon="fa-facebook"
        callback={responseFacebook}
        onFailure={() => setLoader(false)}/>
    </Fragment>


}