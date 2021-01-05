import React, {useState, useReducer} from 'react'
import {Button, Divider, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import GoogleSignIn from "../../components/GoogleSignIn";
import FacebookSignIn from "../../components/FacebookSignIn";
import {handleChange} from "../../helper/handleControlChange";
import {passwordReg, anyReg} from "../../helper/regex";
import {login} from "../../utils/requests";
import { useHistory } from 'react-router'
import BackendError from "../../components/BackendError";
import { Link } from 'react-router-dom'
export default function Login() {
    const [isLoading, setLoading] = useState(false);
    const [socialLoader, setSocialLoader] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const history = useHistory();
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email_phone: '',
            password: '',
        },
    );
    const [loginInputError, setLoginInputError] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email_phone: false,
            password: false,
        },
    );
    const goHome = (link) => {
        history.push(link);
        window.location.reload();
    };
    const handleSubmit = e => {
        e.preventDefault();
        const type = isNaN(Number(loginInput.email_phone)) ? 'email' : 'phone';
        setLoading(true);
        const user = {
            [type]: loginInput.email_phone.trim(),
            password: loginInput.password,
        };
        login(user, setLoading, setBackendError, goHome)
    };
    const validateForm = () => {
        return (
            loginInput.email_phone.length > 0 &&
            !loginInputError.email_phone &&
            loginInput.password.length > 0 &&
            !loginInputError.password
        )
    };
   return <Grid textAlign='center' style={{height: '100vh', padding: '0.5em'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 500}}>
            <Header as='h2' color='teal' textAlign='center'>
                Welcome Back!
            </Header>
            <Form size='large' loading={socialLoader}>
                <Segment stacked>
                    <Form.Input fluid icon='user'
                                iconPosition='left'
                                placeholder='Email or Mobile number'
                                id="email_phone"
                                error={loginInputError.email_phone && {
                                    content: 'Please enter a valid email address or phone number',
                                    pointing: 'below',
                                }}
                                onChange={e => handleChange(e, anyReg, setLoginInput, setLoginInputError)}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        id="password"
                        error={loginInputError.password && {
                            content: 'At least 8 characters',
                            pointing: 'below',
                        }}
                        onChange={e => handleChange(e, passwordReg, setLoginInput, setLoginInputError)}
                    />
                    <Button disabled={isLoading || !validateForm()} type="submit"
                            color='teal' fluid size='large' onClick={!isLoading ? handleSubmit : null} loading={isLoading}>
                        Login
                    </Button>
                    {backendError && <BackendError error={backendError}/> }

                    <Link to="/forget-password">Forget Password</Link>
                    <Message>
                        New to us? <Link to="/register">Sign Up</Link>
                    </Message>
                </Segment>
                <Divider horizontal>Or</Divider>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <GoogleSignIn setLoader={setSocialLoader}/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <FacebookSignIn setLoader={setSocialLoader}/>
                    </Grid.Column>
                </Grid.Row>

            </Form>

        </Grid.Column>
    </Grid>
}