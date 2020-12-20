import React, {useReducer, useState} from 'react'
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import {handleChange} from "../../helper/handleControlChange";
import {anyReg} from "../../helper/regex";
import {sendForgetCode} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import {saveInSessionStorage} from "../../helper/storage";
export default function ForgetPassword({history}) {
    const [isLoading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email_phone: '',
        },
    );
    const [emailPhoneError, setEmailPhoneError] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email_phone: false,
        },
    );
    const goResetPage = () => {
        saveInSessionStorage('user', loginInput.email_phone);
        history.push('/reset-password');
    };

    const validateForm = () => {
        return (
            loginInput.email_phone.length > 0 &&
            !emailPhoneError.email_phone
        )
    };
    const handleSubmit = e => {
        e.preventDefault();
        const type = isNaN(Number(loginInput.email_phone)) ? 'email' : 'phone';
        setLoading(true);
        const user = {
            [type]: type === 'email' ? loginInput.email_phone.trim() : loginInput.email_phone,
        };
        sendForgetCode(user, setLoading, setBackendError, goResetPage)
    };

    return <Grid textAlign='center' style={{ height: '100vh', padding: '0.5em' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 500 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Enter email or phone
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='user'
                                iconPosition='left'
                                placeholder='Email or Mobile number'
                                id="email_phone"
                                error={emailPhoneError.email_phone && {
                                    content: 'Please enter a valid email address or phone number',
                                    pointing: 'below',
                                }}
                                onChange={e => handleChange(e, anyReg, setLoginInput, setEmailPhoneError)}
                    />
                    <Button color='teal'
                            disabled={isLoading || !validateForm()}
                            onClick={!isLoading ? handleSubmit : null} loading={isLoading} fluid size='large'>
                        Send Code
                    </Button>
                    {backendError && <BackendError error={backendError}/> }
                </Segment>
            </Form>
        </Grid.Column>
    </Grid>
}