import React, {Component} from "react";
import {
    Comment,
    Form,
    Button,
    Header,
    Container,
    Icon,
    Message,
    Image,
    Placeholder,
    Loader,
} from "semantic-ui-react";
import {addComment, deletComment, getPostComments} from "../../utils/requests";
import {withRouter} from "react-router";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import {getFromLocalStorage} from "../../helper/storage";
import isVideo from "../../helper/isVideo";
import CommentUpload from "./CommentUpload";
class Comments extends Component{
    constructor(props) {
        super(props);
        this.state = {id: this.props.match.params.id,loading: true,
            backendError: null, files: [], filesPrev: [], content: '',
            comments: null, page: 1, total: 1,skip: 0,
            moreLoader: false, deletingCommentId: null, addCommentLoader: false};
        this.loadMoreComments = this.loadMoreComments.bind(this);
        this.uploadComment = this.uploadComment.bind(this);
    }
    componentDidMount() {
        getPostComments(this);
    }
    loadMoreComments = () => {
        this.setState({moreLoader: true});
        if(this.state.total >= this.state.page){
            getPostComments(this);
        }
    };
    uploadComment(){
        let commentData = new FormData();
        if (this.state?.content.trim() !== '' || this.state.files.length > 0) {
            if(this.state?.content.trim() !== ''){
                commentData.append(
                    'content',
                    this.state.content.trim()
                );
            }
            if(this.state.files.length > 0){
                this.state.files.map(file => commentData.append('media', file))
            }
            this.setState({addCommentLoader: true});
            addComment(this, commentData);
        }
    }
    render() {
        const {loading, comments, backendError, page, total, moreLoader, deletingCommentId, content, addCommentLoader, id} = this.state;
        return <Container>
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
            </Placeholder>}

            <Comment.Group>
                {comments && comments.map(comment => (
                        <Comment key={comment._id} className={deletingCommentId === comment._id ? 'deleting' : ''}>
                            <Comment.Avatar onClick={() => this.props.history.push(`/auth/profile/${comment.author._id}`)} src={comment.author?.avatar ? comment.author.avatar : defaultAvatar} />
                            <Comment.Content>
                                <Comment.Author onClick={() => this.props.history.push(`/auth/profile/${comment.author._id}`)} as='a'>{comment.author?.name ? comment.author.name : (
                                    comment.author?.email ? comment.author?.email : comment.author.phone
                                )}</Comment.Author>
                                <Comment.Metadata>
                                    <div>
                                        <Moment fromNow>
                                            {new Date(comment.updated_at)}
                                        </Moment>
                                    </div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.content}</Comment.Text>

                                <Image.Group size='tiny'>
                                    {comment?.media && comment?.media.map(media => (
                                        isVideo(media.path) ?  <Image key={media._id} as="a" href={media.path}
                                                                      target='_blank' src={'https://react.semantic-ui.com//images/image-16by9.png'} />:
                                        <Image key={media._id} as="a" href={media.path}
                                               target='_blank' src={media.path} />
                                    ))}
                                </Image.Group>
                                {deletingCommentId === null && <Comment.Actions>

                                    {comment.author._id === getFromLocalStorage('userData')?.userId &&  <Comment.Action onClick={() => this.props.history.push(`/auth/post/${id}/${comment._id}`)}>
                                        <Icon name="edit" />
                                        Edit
                                    </Comment.Action>}

                                    {(comment.author._id === getFromLocalStorage('userData')?.userId || comment.post.author === getFromLocalStorage('userData')?.userId) &&
                                    <Comment.Action className="text-danger" onClick={() => {
                                        this.setState({deletingCommentId: comment._id});
                                        deletComment(this,comment._id);
                                    }}>
                                        <Icon name="remove" />
                                        Delete
                                    </Comment.Action>}
                                </Comment.Actions>}

                            </Comment.Content>
                        </Comment>
                    ))}
                {(total >= page && !moreLoader && !loading) && <p className="text-center load-text" onClick={this.loadMoreComments}>Load More Comments</p> }
                {moreLoader && <Loader active inline='centered' /> }
                <Header as='h3' dividing/>
                <Form reply loading={addCommentLoader}>
                    <Form.TextArea value={content} onChange={e => this.setState({content: e.target.value})}/>
                    <CommentUpload _this={this} />
                    <Button content='Add Comment' disabled={addCommentLoader} labelPosition='left' icon='comment' secondary onClick={this.uploadComment}/>
                </Form>
            </Comment.Group>
            {comments?.length === 0 && <Message negative>
                <Message.Header>There aren't any comments on this post</Message.Header>
            </Message>}

            {backendError && <BackendError error={backendError}/> }
        </Container>
    }


}
export default withRouter(Comments);