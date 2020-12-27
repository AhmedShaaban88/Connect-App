import React, {useEffect, useState} from "react";
import {Grid, Card, Container, Placeholder, Loader, Message} from "semantic-ui-react";
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
    const [totalPages, setTotalPages] =useState(1);
    const {id} = useParams();

    useEffect(()=>{
        getYourFriends(id,page,setPage, setFriends,setLoading,setBackendError, setTotalPages);
    },[id]);
    const loadMoreFriends = (page) => {
        if(totalPages >= page){
            getYourFriends(id,page,setPage,setFriends,setLoading,setBackendError, friends);
        }
    };
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
            <div className="lazy-parent">
        <InfiniteScroll
            pageStart={page}
            loadMore={loadMoreFriends}
            hasMore={totalPages > page}
            loader={<Loader active inline='centered' />}
            className="lazy"
            useWindow={false}
        >
        <Grid>

                <Grid.Row>

                            {friends.map(friend => (
                                <Grid.Column mobile={16} tablet={8} computer={4} key={friend._id} onClick={() => history.push(`/auth/profile/${friend.recipient._id}`)}>
                                    <Card
                                        image={friend.recipient.avatar ? friend.recipient.avatar : defaultImage}
                                        header={friend.recipient.name ? friend.recipient.name : ''}
                                        meta={friend.recipient.email ? friend.recipient.email : friend.recipient.phone}
                                    />
                                </Grid.Column>
                            ))}

                </Grid.Row>

        </Grid>
        </InfiniteScroll>
            </div>
        }
        {friends?.length === 0 && <Message negative>
            <Message.Header>We're sorry you haven't any friend</Message.Header>
        </Message>}

        {backendError && <BackendError error={backendError}/> }

    </Container>
}