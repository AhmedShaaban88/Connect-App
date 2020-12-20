import React, {useReducer, useState} from 'react'
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import Avatar from "../../components/Avatar";
import {Link, useHistory} from "react-router-dom";
import {register} from "../../utils/requests";
import {handleChange} from "../../helper/handleControlChange";
import {nicknameReg, passwordReg, phoneReg} from "../../helper/regex";
import PreviewAvatar from "../../components/Avatar/previewAvatar";
import BackendError from "../../components/BackendError";

const RegisterPhone = () => {
    const [isLoading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [avatarPrev, setAvatarPrev] = useState(null);
    const history = useHistory();
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            phone: '',
            password: '',
            uname: '',
            avatar: ''
        },
    );
    const [loginInputError, setLoginInputError] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            phone: false,
            password: false,
            uname: false
        },
    );
    const validateForm = () => {
        return (
            loginInput.phone.length > 0 &&
            !loginInputError.phone &&
            loginInput.password.length > 0 &&
            !loginInputError.password&&
            loginInput.uname.length > 0 &&
            !loginInputError.uname
        )
    };
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        const user = new FormData();
        user.append('phone', loginInput.phone.trim());
        user.append('password', loginInput.password);
        user.append('name', loginInput.uname.trim());
        user.append('avatar', loginInput.avatar);
        register(user, setLoading, setBackendError, goHome)
    };
    const goHome = () => history.push('/verify-code');
    return <Grid textAlign='center' style={{height: '100vh', padding: '0.5em'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 500}}>
            <Header as='h2' color='teal' textAlign='center'>
                Register by phone
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='phone' iconPosition='left' placeholder='Phone*' id="phone"
                                error={loginInputError.phone && {
                                    content: 'Only egyptian phone numbers',
                                    pointing: 'below',
                                }}
                                onChange={e => handleChange(e, phoneReg, setLoginInput, setLoginInputError)}/>
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
                    <Avatar setPhoto={setLoginInput}
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

export default RegisterPhone