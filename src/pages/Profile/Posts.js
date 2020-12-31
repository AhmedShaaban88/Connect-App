import React, {useEffect, useState} from "react";
import {Dropdown, Container, Grid, Feed, Icon, Message, Placeholder, Button} from "semantic-ui-react";
import {useHistory, useParams} from "react-router";
import {getYourPosts} from "../../utils/requests";
import BackendError from "../../components/BackendError";

export default function Posts() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [posts, setPosts] =useState(null);
    const [page, setPage] =useState(1);
    const [totalPages, setTotalPages] =useState(1);
    const options = [
        { key: 'edit', icon: 'edit', text: 'Edit Post', value: 'edit' },
        { key: 'delete', icon: 'delete', text: 'Remove Post', value: 'delete' },
    ]
    const {id} = useParams();
    useEffect(()=>{
        getYourPosts(id,page,setPage, setPosts,setLoading,setBackendError, setTotalPages);
    },[id]);
    const loadMorePosts = (page) => {
        if(totalPages >= page){
            getYourPosts(id,page,setPage,setPosts,setLoading,setBackendError, posts);
        }
    };
    return <Container>
        {isLoading &&
        <Placeholder>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>

        }
        <Feed>
            <Feed.Event>
                <Dropdown
                    options={options}
                    icon={false}
                    trigger={<span>
    <Icon name='ellipsis vertical' />
  </span>}
                />
                <Feed.Label image='/images/avatar/small/joe.jpg' />
                <Feed.Content>
                    <Feed.Summary>
                        <a>Joe Henderson</a>
                        <Feed.Date>3 days ago</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                        Ours is a life of constant reruns. We're always circling back to where
                        we'd we started, then starting all over again. Even if we don't run
                        extra laps that day, we surely will come back for more of the same
                        another day soon.
                    </Feed.Extra>
                    <Feed.Extra images>
                        <img src='https://react.semantic-ui.com/images/wireframe/image.png' />
                        <img src='https://react.semantic-ui.com/images/wireframe/image.png' />
                        <video src="" />
                    </Feed.Extra>
                    <Feed.Meta>
                        <Feed>
                            <Icon name='like' />5 Likes
                            <Icon name='comment' />5 Comments
                        </Feed>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
            <Feed.Event>
                <Dropdown
                    options={options}
                    icon={false}
                    trigger={<span>
    <Icon name='ellipsis vertical' />
  </span>}
                />
                <Feed.Label image='/images/avatar/small/joe.jpg' />
                <Feed.Content>
                    <Feed.Summary>
                        <a>Joe Henderson</a>
                        <Feed.Date>3 days ago</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                        Ours is a life of constant reruns. We're always circling back to where
                        we'd we started, then starting all over again. Even if we don't run
                        extra laps that day, we surely will come back for more of the same
                        another day soon.
                    </Feed.Extra>
                    <Feed.Extra images>
                        <img src='https://react.semantic-ui.com/images/wireframe/image.png' />
                        <img src='https://react.semantic-ui.com/images/wireframe/image.png' />
                        <video src="" />
                    </Feed.Extra>
                    <Feed.Meta>
                        <Feed>
                            <Icon name='like' />5 Likes
                            <Icon name='comment' />5 Comments
                        </Feed>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
        </Feed>

        {posts?.length === 0 && <Message negative>
            <Message.Header>We're sorry you haven't any posts</Message.Header>
        </Message>}

        {backendError && <BackendError error={backendError}/> }
    </Container>
}