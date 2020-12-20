import React from 'react';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
    console.log(response);
}
export default function FacebookSignIn(){
    return  <FacebookLogin
        appId="1088597931155576"
        autoLoad={true}
        fields="name,email,picture"
        size="metro"
        icon="fa-facebook"
       // onClick={componentClicked}
        callback={responseFacebook} />
}