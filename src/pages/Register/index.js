import React from 'react'
import {Button, Divider, Grid, Header, Segment} from 'semantic-ui-react'
import {Route, Switch} from "react-router";
import RegisterMail from "./email";
import RegisterPhone from "./phone";
import NotFound from "../NotFound";
import {useHistory} from "react-router";

const RegisterPage = () => {
     const history = useHistory();
    return <Grid textAlign='center' style={{height: '100vh', padding: '0.5em'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 500}}>
            <Header as='h2' color='teal' textAlign='center'>
                Choose your register method
            </Header>
            <Segment>
                <Button content='Email' icon='mail' size='big' onClick={() => history.push("/register/mail")}/>
                <Divider horizontal>Or</Divider>

                <Button content='Phone' icon='phone' size='big' onClick={() => history.push("/register/phone")}/>

            </Segment>
        </Grid.Column>
    </Grid>
};
const Register = () => (
    <Switch>
        <Route path="/register/mail" exact component={RegisterMail} />
        <Route path="/register/phone" exact component={RegisterPhone} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="**" component={NotFound}/>
    </Switch>
);

export default Register