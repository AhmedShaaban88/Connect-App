import React, {useState} from 'react'
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {Redirect} from "react-router";
import {resendVerifyCode, verifyAccount} from "../../utils/requests";
import {getFromSessionStorage} from "../../helper/storage";
import BackendError from "../../components/BackendError";
import { useToasts } from 'react-toast-notifications'

export default function VerifyCode({history}) {
    const { addToast } = useToasts();
    const [isLoading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [code, setCode] = useState('');
    const userData =  getFromSessionStorage('user');
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        const user = {
            userId: userData.user_id,
            code: Number(code)
        };
        const goHome = () => {
            history.push('/auth/dashboard');
            window.location.reload();
        };
        verifyAccount(user, setLoading, setBackendError, goHome)
    };
    const validateForm = () => {
        return (
            code.trim().length > 0
        )
    };
    const showToast =  () => addToast('send verification code successfully', {
        appearance: 'success',
        autoDismiss: true,
    });
    const resendVerify = () => {
        const type = userData.email ? 'email' : 'phone';
        resendVerifyCode({[type]: type === 'email' ? userData.email : userData.phone},
            setResendLoading, setBackendError, showToast);
    };
    return history.action === 'PUSH' ?
    <Grid textAlign='center' style={{ height: '100vh', padding: '0.5em' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 500 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Verify Code
            </Header>
            <Form size='large' loading={resendLoading}>
                <Segment stacked>
                    <Form.Input
                        fluid
                        icon='eye slash'
                        iconPosition='left'
                        placeholder='Code*'
                        type='text'
                        id="code"
                        onChange={e => setCode(e.target.value)}
                    />
                    <Button color='teal' disabled={isLoading || !validateForm()} type="submit"
                            onClick={!isLoading ? handleSubmit : null} loading={isLoading} fluid size='large'>
                        Check Code
                    </Button>
                    {backendError && <BackendError error={backendError}/> }
                    <a onClick={resendVerify}>Resend Verification Code</a>
                </Segment>
            </Form>
        </Grid.Column>
    </Grid> : <Redirect to="/" />
}
VerifyCode.propTypes = {
    history: PropTypes.object,
};