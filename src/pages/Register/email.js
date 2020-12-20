import React, {useState, useReducer} from 'react'
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import Avatar from "../../components/Avatar";
import {Link, useHistory} from "react-router-dom";
import {register} from "../../utils/requests";
import {handleChange} from "../../helper/handleControlChange";
import {nicknameReg, passwordReg, personalEmailReg} from "../../helper/regex";
import BackendError from "../../components/BackendError";
import PreviewAvatar from "../../components/Avatar/previewAvatar";
const RegisterMail = () => {
    const [isLoading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [avatarPrev, setAvatarPrev] = useState(null);
    const history = useHistory();
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            email: '',
            password: '',
            uname: '',
            avatar: ''
        },
    );
    const [loginInputError, setLoginInputError] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            email: false,
            password: false,
            uname: false
        },
    );
        const validateForm = () => {
        return (
            loginInput.email.length > 0 &&
            !loginInputError.email &&
            loginInput.password.length > 0 &&
            !loginInputError.password&&
            loginInput.uname.length > 0 &&
            !loginInputError.uname
        )
    };
    const goHome = () => history.push('/verify-code');
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        const user = new FormData();
        user.append('email', loginInput.email.trim());
        user.append('password', loginInput.password);
        user.append('name', loginInput.uname.trim());
        user.append('avatar', loginInput.avatar);
        register(user, setLoading, setBackendError, goHome)
    };
    return <Grid textAlign='center' style={{height: '100vh', padding: '0.5em'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 500}}>
            <Header as='h2' color='teal' textAlign='center'>
                Register by email
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='mail' iconPosition='left' placeholder='Email*'
                                id="email"
                                error={loginInputError.email && {
                                    content: 'Please enter a valid email address',
                                    pointing: 'below',
                                }}
                                onChange={e => handleChange(e, personalEmailReg, setLoginInput, setLoginInputError)}/>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Username'
                                id="uname"
                                error={loginInputError.uname && {
                                    content: 'At least 3 characters without special characters',
                                    pointing: 'below',
                                }}
                                onChange={e => handleChange(e, nicknameReg, setLoginInput, setLoginInputError)}/>
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password*'
                        type='password'
                        id="password"
                        error={loginInputError.password && {
                            content: 'At least 8 characters',
                            pointing: 'below',
                        }}
                        onChange={e => handleChange(e, passwordReg, setLoginInput, setLoginInputError)}
                    />
                    <Avatar  setPhoto={setLoginInput}
                             setAvatarPrev={setAvatarPrev}/>
                    {avatarPrev && (
                        <PreviewAvatar
                            setAvatarPrev={setAvatarPrev}
                            image={avatarPrev}
                            setAvatar={setLoginInput}
                        />
                    )}
                    <Button color='teal' fluid size='large' disabled={isLoading || !validateForm()} onClick={!isLoading ? handleSubmit : null} loading={isLoading}>
                        Register
                    </Button>
                    {backendError && <BackendError error={backendError}/> }

                    <Link to="/">Already a user</Link>

                </Segment>

            </Form>
        </Grid.Column>
    </Grid>
};

export default RegisterMail