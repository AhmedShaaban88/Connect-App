import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import {postLikes} from "../../utils/requests";
import {Card, Container, Grid, Loader, Message, Placeholder} from "semantic-ui-react";
import defaultImage from "../../assets/images/user.png";
import BackendError from "../../components/BackendError";

export default function Likes() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [likes, setLikes] =useState(null);
    const {id} = useParams();
    useEffect(()=>{
       postLikes(id,setLoading, setBackendError, setLikes);
    },[id]);
    return <Container>
        {isLoading &&
        <Card.Group itemsPerRow={3}>
            <Card>
                <Card.Content>
                    <Placeholder>
                        <Placeholder.Image rectangular/>
                    </Placeholder>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Placeholder>
                        <Placeholder.Image rectangular/>
                    </Placeholder>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Placeholder>
                        <Placeholder.Image rectangular/>
                    </Placeholder>
                </Card.Content>
            </Card>
        </Card.Group>
        }
        {likes &&
                <Grid>

                    <Grid.Row>
                        {likes.map(friend => (
                            <Grid.Column mobile={16} tablet={8} computer={4} key={friend._id} onClick={() => history.push(`/auth/profile/${friend._id}`)}>
                                <Card
                                    image={friend.avatar ? friend.avatar : defaultImage}
                                    header={friend.name ? friend.name : ''}
                                    meta={friend.email ? friend.email : friend.phone}
                                />
                            </Grid.Column>
                        ))}

                    </Grid.Row>

                </Grid>
        }
        {likes?.length === 0 && <Message negative>
            <Message.Header>there aren't any likes on this post</Message.Header>
        </Message>}

        {backendError && <BackendError error={backendError}/> }

    </Container>
}