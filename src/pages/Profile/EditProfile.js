import React, {useReducer, useState} from "react";
import {handleChange} from "../../helper/handleControlChange";
import {passwordReg, nicknameReg, personalEmailReg, phoneReg} from "../../helper/regex";
import BackendError from "../../components/BackendError";
import {friendActions, updateProfile} from "../../utils/requests";
import Avatar from "../../components/Avatar";
import PreviewAvatar from "../../components/Avatar/previewAvatar";
import {getFromLocalStorage} from "../../helper/storage";
import {Button, Container, Form, Grid, Header, Segment} from "semantic-ui-react";
import {useToasts} from "react-toast-notifications";
export default function EditProfile({user}) {
    const [isLoading, setLoading] = useState(false);
    const [friendLoading, setFriendLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [avatarPrev, setAvatarPrev] = useState(user.avatar ? user.avatar : null);
    const type = user.email ? 'email' : 'phone';
    const { addToast } = useToasts();
    const [loginInput, setLoginInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            name: user.name ? user.name : '',
            [type]: user.phone ? user.phone : user.email,
            password: '',
            status: user.status,
            editable: user.editable,
            avatar: user.avatar ? user.avatar : ''
        },
    );
    const [loginInputError, setLoginInputError] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            name: false,
            password: false
        },
    );
    const showToast =  () => {
        addToast('Update Profile successfully', {
            appearance: 'success',
            autoDismiss: true,
        });
    };
    const validateForm = () => {
        return (
            loginInput.name.length > 0 &&
            !loginInputError.name &&
            loginInput.password.length > 0 &&
            !loginInputError.password
        )
    };
    const handleSubmit = e => {
        e.preventDefault();
        if(validateForm()){
            setLoading(true);
            const user = new FormData();
            user.append('name', loginInput.name.trim());
            user.append('password', loginInput.password);
            if(!loginInput.avatar && getFromLocalStorage('userData')?.avatar){
                user.append('deleteAvatar', true)
            }else{
                user.append('avatar', loginInput.avatar);
            }
           updateProfile(user, setLoading, setBackendError, showToast);
        }else{
            setBackendError( 'Some fields are incorrect');
        }

    };
    const friendActionFunc = (type, status) => {
        setFriendLoading(true);
        friendActions(type, user._id,setFriendLoading ,setBackendError, setLoginInput, status);
    };
    return <Grid textAlign='center' style={{height: '30vh', padding: '0.5em'}} verticalAlign='middle'>
        {loginInput.editable ?  <Grid.Column style={{maxWidth: '100%'}}>
            <Header as='h2' color='teal' textAlign='center'>
                Basic Information
            </Header>
            <Form size='large'>
                <Segment stacked>

                    <Form.Input fluid icon={type === 'email' ? 'mail' : 'phone'} iconPosition='left' placeholder={type === 'email' ? 'Email*' : 'Phone*'}
                                id={type}
                                value={loginInput[type]}
                                error={loginInputError[type] && {
                                    content: type === 'email' ? 'Please enter a valid email address' : 'Only egyptian phone numbers',
                                    pointing: 'below',
                                }}
                                readOnly={true}
                                onChange={e => handleChange(e, type === 'email' ? personalEmailReg : phoneReg, setLoginInput, setLoginInputError)}/>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Username'
                                id="name"
                                required
                                value={loginInput.name}
                                error={loginInputError.name && {
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
                        required
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
                    <Button color='teal' fluid size='large' disabled={isLoading} onClick={!isLoading ? handleSubmit : null} loading={isLoading}>
                        Save
                    </Button>

                    {backendError && <BackendError error={backendError}/> }

                </Segment>

            </Form>
        </Grid.Column>: <Container textAlign='center'>
            {avatarPrev && (
                <PreviewAvatar
                    setAvatarPrev={setAvatarPrev}
                    image={avatarPrev}
                    setAvatar={setLoginInput}
                    prev={true}
                />
            )}

            <h1>{loginInput.name}</h1>
            <p>{loginInput.email}</p>
            {loginInput.status === 0 && <Button icon="user plus" disabled={friendLoading} loading={friendLoading} content="Add Friend" onClick={e => friendActionFunc('add', loginInput.status)}/>}
            {loginInput.status === 1 && <Button loading={friendLoading} disabled={friendLoading} negative onClick={e => friendActionFunc('remove', loginInput.status)}>Remove</Button>}
            {loginInput.status === 2 &&  <Button.Group>
                <Button negative loading={friendLoading} disabled={friendLoading} onClick={e => friendActionFunc('remove', 'reject')}>Reject</Button>
                <Button.Or />
                <Button positive loading={friendLoading} disabled={friendLoading} onClick={e => friendActionFunc('accept', 'accept')}>Accept</Button>
            </Button.Group>}
            {loginInput.status === 3 && <Button loading={friendLoading} disabled={friendLoading} secondary icon="user delete" onClick={e => friendActionFunc('remove', loginInput.status)} content="Remove Friend"/>}
            <Button icon="envelope" content="Message" className="msg-btn" secondary/>
            {backendError && <BackendError error={backendError}/> }
        </Container>}

        </Grid>
}

