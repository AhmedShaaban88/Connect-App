import React, {useEffect, useState} from "react";
import {Grid, Card, Container, Placeholder, Loader} from "semantic-ui-react";
import BackendError from "../../components/BackendError";
import {useHistory, useParams} from "react-router";
import {getYourFriends} from "../../utils/requests";
import defaultImage from '../../assets/images/user.png';
import InfiniteScroll from 'react-infinite-scroller';
export default function Friends() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [friends, setFriends] =useState(null);
    const [page, setPage] =useState(1);
    const {id} = useParams();
    useEffect(() => {
        getYourFriends(id,page,setFriends,setLoading,setBackendError);
    }, []);
    useEffect(()=>{
        setLoading(true);
        setFriends(null);
        setPage(1);
        getYourFriends(id,page,setFriends,setLoading,setBackendError);
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
        {friends &&
        <Grid>

                <Grid.Row>
                    <InfiniteScroll
                        pageStart={page}
                        //loadMore={loadFunc}
                        hasMore={true}
                        loader={<Loader active inline='centered' />}
                        className="lazy"
                    >
                    {friends.map(friend => (
                        <Grid.Column mobile={16} tablet={8} computer={4} key={friend._id} onClick={() => history.push(`/auth/profile/${friend.recipient._id}`)}>
                            <Card
                                image={friend.recipient.avatar ? friend.recipient.avatar : defaultImage}
                                header={friend.recipient.name}
                                meta={friend.recipient.email ? friend.recipient.email : friend.recipient.phone}
                            />
                        </Grid.Column>
                    ))}
                    </InfiniteScroll>
                </Grid.Row>



        </Grid>
        }
        {backendError && <BackendError error={backendError}/> }

    </Container>
}