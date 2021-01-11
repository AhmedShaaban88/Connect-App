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
    Label, Image, Divider, GridColumn
} from "semantic-ui-react";
import {useHistory, useParams} from "react-router";
import {deletPost, getYourPosts, likePost} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import {getFromLocalStorage} from "../../helper/storage";
import isVideo from "../../helper/isVideo";
import InfiniteScroll from "react-infinite-scroller";


export default function Posts() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [deletePostId, setDeletePostId] = useState(null);
    const [posts, setPosts] =useState(null);
    const [page, setPage] =useState(1);
    const [totalPages, setTotalPages] =useState(1);
    const {id} = useParams();
    useEffect(()=>{
        getYourPosts(id,page,setPage, setPosts,setLoading,setBackendError, setTotalPages);
    },[id]);
    const loadMorePosts = (page) => {
        if(totalPages >= page){
            getYourPosts(id,page,setPage,setPosts,setLoading,setBackendError, posts);
        }
    };
    const likePostFunc = (e,post, index) =>{
        let _posts = [...posts];
        let _post = {...posts[index]};
        if(post.likes.indexOf(getFromLocalStorage('userData')?.userId) > -1){
            _post.likes = _post.likes.filter(like => like !== getFromLocalStorage('userData')?.userId);
            _posts[index] = _post;

        }else{
            _post.likes = _post.likes.concat(getFromLocalStorage('userData')?.userId);
            _posts[index] = _post;
        }
        setPosts(_posts);
        likePost(post._id, setBackendError);
    };
    const removePost = (e, id) => {
        setDeletePostId(id);
        deletPost(id, setBackendError, setPosts, posts, setDeletePostId);
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
            <div className="lazy-parent">
            {posts && <InfiniteScroll
                pageStart={page}
                loadMore={loadMorePosts}
                hasMore={totalPages > page}
                loader={<Loader active inline='centered'/>}
                useWindow={false}
            >
                <Comment.Group>
                {posts.map((post, index) => (
                    <Comment key={post._id} className={deletePostId === post._id ? 'deleting' : ''}>
                        {(post.author === getFromLocalStorage('userData')?.userId && deletePostId === null) &&
                        <Dropdown className="float-right" icon={<span>
                              <Icon name='ellipsis vertical'/>
                                </span>}>
                            <Dropdown.Menu>
                                <Dropdown.Item text='Edit' icon="edit" onClick={() => history.push(`/auth/post/edit/${post._id}`)}/>
                                <Dropdown.Item text='Delete' icon="delete" onClick={e => removePost(e, post._id)}/>
                            </Dropdown.Menu>
                        </Dropdown>
                        }
                        <Comment.Avatar
                            src={post.author?.avatar ? post.author.avatar : defaultAvatar}/>
                        <Comment.Content>
                            <Comment.Author
                                as='a'>{post.author?.name ? post.author.name : (
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
                            <Image.Group size='tiny'>
                                {post?.media && post?.media.map(media => (
                                    isVideo(media.path) ? <Image key={media._id} as="a" href={media.path}
                                                                 target='_blank'
                                                                 src={'https://react.semantic-ui.com//images/image-16by9.png'}/> :
                                        <Image key={media._id} as="a" href={media.path}
                                               target='_blank' src={media.path}/>
                                ))}
                            </Image.Group>
                            <Grid>
                                <GridColumn computer={8} tablet={8} mobile={16}>
                                    <Button as='div' labelPosition='right'>
                                        <Button
                                            color={post.likes.indexOf(getFromLocalStorage('userData')?.userId) > -1 ? 'red' : 'white'}
                                            onClick={e => likePostFunc(e, post, index)}>
                                            <Icon name='heart'/>
                                            {post.likes.indexOf(getFromLocalStorage('userData')?.userId) > -1 ? 'Unlink' : 'Like'}
                                        </Button>
                                        <Label as='a' basic color='red' pointing='left'
                                               onClick={() => history.push(`/auth/post/${post._id}/likes`)}>
                                            {post.likes?.length}
                                        </Label>
                                    </Button>
                                </GridColumn>
                                <GridColumn computer={8} tablet={8} mobile={16}>
                                    <Button as='div' labelPosition='right'
                                            onClick={() => history.push(`/auth/post/${post._id}/comments`)}>
                                        <Button color='blue'>
                                            <Icon name='comment'/>
                                            Add Comment
                                        </Button>
                                        <Label as='a' basic color='blue' pointing='left'>
                                            {post.comments?.length}
                                        </Label>
                                    </Button>
                                </GridColumn>
                            </Grid>
                        </Comment.Content>
                        <Divider/>
                    </Comment>
                ))}
                </Comment.Group>
            </InfiniteScroll>
            }
            </div>




        {(posts?.length === 0 && !isLoading) && <Message negative>
            <Message.Header>We're sorry you haven't any posts</Message.Header>
        </Message>}

        {backendError && <BackendError error={backendError}/> }
    </Container>
}