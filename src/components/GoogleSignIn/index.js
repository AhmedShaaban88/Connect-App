import React, {useState, Fragment} from 'react';
import GoogleLogin from 'react-google-login';
import styled from "styled-components";
import {useHistory} from "react-router";
import {loginGoogle} from "../../utils/requests";
import BackendError from "../BackendError";

const GoogleBtn = styled(GoogleLogin)`
  margin-bottom: 1em;
  font-family: Helvetica,sans-serif!important;
    font-weight: 700!important;
    -webkit-font-smoothing: antialiased!important;
    cursor: pointer;
    font-size: calc(.27548vw + 12.71074px)!important;
    text-decoration: none;
    text-transform: uppercase!important;
    transition: background-color .3s,border-color .3s!important;
    padding: calc(.34435vw + 0.38843px) 1.04435vw!important;
`;
export default function GoogleSignIn({setLoader}) {
    const history = useHistory();
    const [backendError, setBackendError] = useState(null);
    const goHome = () => history.push('/auth/dashboard');
    const responseGoogle = (response) => {
        const {tokenId} = response;
        loginGoogle({tokenId},setLoader,setBackendError, goHome)
    };
return <Fragment>
    {backendError && <BackendError error={backendError}/> }
    <GoogleBtn
        clientId="4106995663-r8hno42va4em20m8jq7msdpel66a411d.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={() => setLoader(false)}
        style={{'margin-bottom': '1em', 'background': 'red'}}
        cookiePolicy={'single_host_origin'}
    />

</Fragment>
};