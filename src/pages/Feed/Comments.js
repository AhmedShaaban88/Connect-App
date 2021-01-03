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
    Embed
} from "semantic-ui-react";
import {getPostComments} from "../../utils/requests";
import {withRouter} from "react-router";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import {getFromLocalStorage} from "../../helper/storage";
import isVideo from "../../helper/isVideo";
class Comments extends Component{
    constructor(props) {
        super(props);
        this.state = {id: this.props.match.params.id,loading: true, backendError: null,
            comments: null, page: 1, total: 1,skip: 0, moreLoader: false};
        this.loadMoreComments = this.loadMoreComments.bind(this);
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
    render() {
        const {loading, comments, backendError, page, total, moreLoader} = this.state;
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
                        <Comment key={comment._id}>
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
                                <Comment.Actions>

                                    {comment.author._id === getFromLocalStorage('userData')?.userId &&  <Comment.Action>
                                        <Icon name="edit" />
                                        Edit
                                    </Comment.Action>}

                                    {(comment.author._id === getFromLocalStorage('userData')?.userId || comment.post.author === getFromLocalStorage('userData')?.userId) &&<Comment.Action className="text-danger">
                                        <Icon name="remove" />
                                        Delete
                                    </Comment.Action>}
                                </Comment.Actions>
                            </Comment.Content>
                        </Comment>
                    ))}
                {(total >= page && !moreLoader && !loading) && <p className="text-center load-text" onClick={this.loadMoreComments}>Load More Comments</p> }
                {moreLoader && <Loader active inline='centered' /> }
                <Header as='h3' dividing/>
                <Form reply>
                    <Form.TextArea/>
                    <Button size="small" content='Upload Media' labelPosition='left' icon='file' primary />  <br/> <br/>
                    <Button content='Add Comment' labelPosition='left' icon='comment' secondary />
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