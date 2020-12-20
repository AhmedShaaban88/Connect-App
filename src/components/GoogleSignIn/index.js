import React from 'react';
import GoogleLogin from 'react-google-login';
import styled from "styled-components";

const responseGoogle = (response) => {
    console.log(response);
}
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
`
export default function GoogleSignIn() {
return <GoogleBtn
    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
    buttonText="Login with Google"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    style={{'margin-bottom': '1em', 'background': 'red'}}
    cookiePolicy={'single_host_origin'}
/>
};