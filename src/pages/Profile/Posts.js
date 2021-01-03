import React, {useEffect, useState, Fragment} from "react";
import {
    Dropdown,
    Container,
    Grid,
    Comment,
    Icon,
    Message,
    Placeholder,
    Button,
    Loader,
    Header, Form
} from "semantic-ui-react";
import {useHistory, useParams} from "react-router";
import {getYourPosts} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import {getFromLocalStorage} from "../../helper/storage";


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
        <Fragment>
            <Dropdown
                options={options}
                icon={false}
                trigger={<span>
    <Icon name='ellipsis vertical' />
  </span>}
            />
            <Comment.Group>
                {posts && posts.map(post => (
                    <Comment key={post._id}>
                        <Comment.Avatar src={getFromLocalStorage('userData')?.avatar ? getFromLocalStorage('userData')?.avatar : defaultAvatar} />
                        <Comment.Content>
                            <Comment.Author as='a'>{getFromLocalStorage('userData')?.name ? getFromLocalStorage('userData')?.name  : (
                                post.author?.email ? post.author?.email : post.author.phone
                            )}</Comment.Author>
                            <Comment.Metadata>
                                <div>
                                    <Moment fromNow>
                                        {new Date(post.updated_at)}
                                    </Moment>
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>{post.content}</Comment.Text>
                            {/*<Comment.Actions>*/}

                            {/*    {comment.author._id === getFromLocalStorage('userData')?.userId &&  <Comment.Action>*/}
                            {/*        <Icon name="edit" />*/}
                            {/*        Edit*/}
                            {/*    </Comment.Action>}*/}

                            {/*    <Comment.Action className="text-danger">*/}
                            {/*        <Icon name="remove" />*/}
                            {/*        Delete*/}
                            {/*    </Comment.Action>*/}
                            {/*</Comment.Actions>*/}
                        </Comment.Content>
                    </Comment>
                ))}
                {/*{(total >= page && !moreLoader && !loading) && <p className="text-center load-text" onClick={this.loadMoreComments}>Load More Comments</p> }*/}
                {/*{moreLoader && <Loader active inline='centered' /> }*/}
            </Comment.Group>
        </Fragment>

        {posts?.length === 0 && <Message negative>
            <Message.Header>We're sorry you haven't any posts</Message.Header>
        </Message>}

        {backendError && <BackendError error={backendError}/> }
    </Container>
}