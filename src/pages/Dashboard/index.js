import React, {Component} from "react";
import {
    Button,
    Comment,
    Container, Divider,
    Dropdown,
    Form,
    Grid,
    GridColumn,
    Icon,
    Image, Label,
    Loader, Message,
    Placeholder
} from "semantic-ui-react";
import CommentUpload from "../Feed/CommentUpload";
import isVideo from "../../helper/isVideo";
import BackendError from "../../components/BackendError";
import {deletPostDashboard, getDashboard, likePostDashboard, createPost} from "../../utils/requests";
import InfiniteScroll from "react-infinite-scroller";
import {getFromLocalStorage} from "../../helper/storage";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import DashboardSocket from "../../publicSocket/DashboardSocket";
export default class DashboardPage extends Component{
    constructor(props) {
        super(props);
        this.state = {loading: true, posts: [],
            backendError: null, files: [],
            filesPrev: [], content: '',
            page: 1, total: 1,skip: 0,
            newPosts: [],
            moreLoader: false,deletePostId: null,
            addPostLoader: false};
        this.loadMorePosts = this.loadMorePosts.bind(this);
        this.removePost = this.removePost.bind(this);
        this.likePostFunc = this.likePostFunc.bind(this);
        this.newPost = this.newPost.bind(this);
        this.socketNewPosts = this.socketNewPosts.bind(this);
    }
    componentDidMount() {
        getDashboard(this);
        DashboardSocket.on('new-post', (data) => {
            this.setState(prevState => ({newPosts: [data, ...prevState.newPosts]}));
        });
    }
    socketNewPosts(){
        this.setState(prevState => ({
            posts: [...this.state.newPosts,...prevState.posts],skip: prevState.skip + prevState.newPosts.length, newPosts: []}));
        DashboardSocket.emit('seen', 'seen all');
    }
    loadMorePosts = (page) => {
        if(this.state.total >= this.state.page && !this.state.moreLoader){
            this.setState({moreLoader: true});
            getDashboard(this);
        }
    };
    newPost(){
        let postData = new FormData();
        if (this.state?.content.trim() !== '' || this.state.files.length > 0) {
                postData.append(
                    'content',
                    this.state.content.trim() ? this.state.content.trim() : ''
                );
            if(this.state.files.length > 0){
                this.state.files.map(file => postData.append('media', file))
            }
            this.setState({addPostLoader: true});
            createPost(this, postData);
        }
    }
    removePost = (e, id) => {
        this.setState({
            deletePostId: id
        });
        deletPostDashboard(id, this);
    };
    likePostFunc = (e,post, index) =>{
        let _posts = [...this.state.posts];
        let _post = {...this.state.posts[index]};
        if(post.likes.indexOf(getFromLocalStorage('userData')?.userId) > -1){
            _post.likes = _post.likes.filter(like => like !== getFromLocalStorage('userData')?.userId);
            _posts[index] = _post;

        }else{
            _post.likes = _post.likes.concat(getFromLocalStorage('userData')?.userId);
            _posts[index] = _post;

        }
        this.setState({posts: _posts});
        likePostDashboard(post._id, this);
    };
    render() {
        const {loading, backendError, content, addPostLoader, posts, page, total, deletePostId, moreLoader, newPosts} = this.state;

        return (
            <Container>
                {newPosts.length > 0 && <Label color="red" size="large" floating className="new-post" onClick={this.socketNewPosts}>+New Posts</Label> }
                <Form reply loading={addPostLoader}>
                    <Form.TextArea placeholder="What's on your mind?" value={content} onChange={e => this.setState({content: e.target.value})}/>
                    <CommentUpload _this={this} />
                    <Button content='Post' disabled={addPostLoader} secondary onClick={this.newPost}/>
                </Form><br/><br/> <br/> <br/>
                {loading &&  <Placeholder>
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
                    </Placeholder.Paragraph><Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                </Placeholder>}
                <div className="lazy-parent">
                    {posts && <InfiniteScroll
                        pageStart={page}
                        loadMore={this.loadMorePosts}
                        hasMore={total > page}
                        useWindow={false}
                    >
                        <Comment.Group>
                            {posts.map((post, index) => (
                                <Comment key={post._id} className={deletePostId === post._id ? 'deleting' : ''}>
                                    {(post?.author._id === getFromLocalStorage('userData')?.userId || post?.author === getFromLocalStorage('userData')?.userId) && deletePostId === null &&
                                    <Dropdown className="float-right" icon={<span>
                              <Icon name='ellipsis vertical'/>
                                </span>}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item text='Edit' icon="edit" onClick={() => this.props.history.push(`/auth/post/edit/${post._id}`)}/>
                                            <Dropdown.Item text='Delete' icon="delete" onClick={e => this.removePost(e, post._id)}/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    }
                                    <Comment.Avatar
                                        src={post.author?.avatar ? post.author.avatar : (getFromLocalStorage('userData')?.avatar ? getFromLocalStorage('userData').avatar : defaultAvatar)}/>
                                    <Comment.Content>
                                        <Comment.Author
                                            as='a'>{
                                                typeof post.author === 'object' ? (post.author?.name ? post.author.name : (
                                            post.author?.email ? post.author?.email : post.author.phone )): getFromLocalStorage('userData')?.name ? getFromLocalStorage('userData').name : (getFromLocalStorage('userData')?.email ? getFromLocalStorage('userData').email : getFromLocalStorage('userData').phone)
                                        }</Comment.Author>
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
                                                        onClick={e => this.likePostFunc(e, post, index)}
                                                    >
                                                        <Icon name='heart'/>
                                                        {post.likes.indexOf(getFromLocalStorage('userData')?.userId) > -1 ? 'Unlink' : 'Like'}
                                                    </Button>
                                                    <Label as='a' basic color='red' pointing='left'
                                                           onClick={() => this.props.history.push(`/auth/post/${post._id}/likes`)}>
                                                        {post.likes?.length}
                                                    </Label>
                                                </Button>
                                            </GridColumn>
                                            <GridColumn computer={8} tablet={8} mobile={16}>
                                                <Button as='div' labelPosition='right'
                                                        onClick={() => this.props.history.push(`/auth/post/${post._id}/comments`)}>
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
                    {moreLoader && <Loader active inline='centered'/>}
                </div>
                {(posts?.length === 0 && !loading) && <Message>
                    <Message.Header>There aren't any posts on your dashboard</Message.Header>
                </Message>}
                {backendError && <BackendError error={backendError}/> }

            </Container>

        )
    }


}