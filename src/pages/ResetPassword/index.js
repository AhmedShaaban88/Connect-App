import React, {useEffect, useReducer, useState} from 'react'
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import {Redirect} from "react-router";
import {resetPassword, sendForgetCode} from "../../utils/requests";
import {getFromSessionStorage} from "../../helper/storage";
import {useToasts} from "react-toast-notifications";
import {handleChange} from "../../helper/handleControlChange";
import {anyReg, passwordReg} from "../../helper/regex";
import BackendError from "../../components/BackendError";

export default function ResetPassword({history}) {
    const [isLoading, setLoading] = useState(false);
    const { addToast } = useToasts();
    const [resendLoading, setResendLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            code: '',
            password: '',
            confPassword: ''
        },
    );
    const [loginInputError, setLoginInputError] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            password: false,
            confPassword: false
        },
    );
    useEffect(() => {
        if (loginInput.confPassword !== loginInput.password && loginInput.confPassword.length > 0 && loginInput.password.length > 0) {
            setLoginInputError({ confPassword: true })
        } else {
            setLoginInputError({ confPassword: false })
        }
    }, [loginInput.confPassword, loginInput.password]);
    const showToast =  () => {
        addToast('reset password successfully', {
            appearance: 'success',
            autoDismiss: true,
        });
        history.push('/');
    };
    const validateForm = () => {
        return (
            loginInput.code.trim().length > 0 &&
            (loginInput.password?.trim().length > 0
                ? !loginInputError.password
                : true) &&
            (loginInput.confPassword?.trim().length > 0
                ? !loginInputError.confPassword
                : true)
        )
    };
    const handleSubmit = e => {
        e.preventDefault();
        const userVal = getFromSessionStorage('user');
        const type = isNaN(Number(userVal)) ?  'email' : 'phone';
        setLoading(true);
        const user = {
            [type]: userVal.trim(),
            code: Number(loginInput.code),
            password: loginInput.password,
            confirmPassword: loginInput.confPassword
        };
        resetPassword(user, setLoading, setBackendError, showToast)
    };
    const showToastResend =  () => {
        addToast('resend code successfully', {
            appearance: 'success',
            autoDismiss: true,
        });
    };
    const resendReset = () => {
        const userVal = getFromSessionStorage('user');
        const type = isNaN(Number(userVal)) ?  'email' : 'phone';
        setResendLoading(true);
        sendForgetCode({[type]: userVal},
            setResendLoading, setBackendError, showToastResend);
    };
    return history.action === 'PUSH' ?
    <Grid textAlign='center' style={{ height: '100vh', padding: '0.5em' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 500 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Reset Password
            </Header>
            <Form size='large' loading={resendLoading}>
                <Segment stacked>
                    <Form.Input
                        fluid
                        icon='eye slash'
                        iconPosition='left'
                        placeholder='Code'
                        type='text'
                        id="code"
                        error={loginInputError.code && {
                            content: 'Please enter a valid code',
                            pointing: 'below',
                        }}
                        onChange={e => handleChange(e, anyReg, setLoginInput, setLoginInputError)}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='New password'
                        type='password'
                        id="password"
                        error={loginInputError.password && {
                            content: 'At least 8 characters',
                            pointing: 'below',
                        }}
                        onChange={e => handleChange(e, passwordReg, setLoginInput, setLoginInputError)}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Confirm new password'
                        type='password'
                        id="confPassword"
                        error={loginInputError.confPassword && {
                            content: 'Confirm password does not match with the password',
                            pointing: 'below',
                        }}
                        onChange={e => {setLoginInput({confPassword: e.target.value})}}
                    />
                    <Button color='teal' disabled={isLoading || !validateForm()} type="submit"
                            onClick={!isLoading ? handleSubmit : null} loading={isLoading} fluid size='large'>
                        Reset
                    </Button>
                    {backendError && <BackendError error={backendError}/> }
                    <a onClick={resendReset}>Resend Forget Code</a>
                </Segment>
            </Form>
        </Grid.Column>
    </Grid> : <Redirect to="/" />
}