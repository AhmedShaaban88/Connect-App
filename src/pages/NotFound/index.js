import React from 'react';
import { useHistory } from 'react-router'
import {Container, Button, Image, Grid, Icon} from "semantic-ui-react";
import NotFoundImg from '../../assets/images/not-found.svg';
import propTypes from "prop-types";

export default function NotFound (){
        const history = useHistory();
        const goHome = () => history.push('/');
        return (

                <Container>
                    <Grid textAlign='center' style={{ height: '100vh', padding: '0.5em' }} verticalAlign='middle'>
                        <Grid.Column>
                            <Image style={{'marginBottom': '2em'}} src={NotFoundImg} alt="not-found-img" fluid/>
                            <Button animated color='violet' size="large" onClick={() => goHome()}>
                                <Button.Content visible>Back Home</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow left' />
                                </Button.Content>
                            </Button>
                        </Grid.Column>

                    </Grid>
                </Container>
        )
}

NotFound.propTypes = {
    history: propTypes.object
};