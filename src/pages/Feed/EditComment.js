import React, {Component} from "react";
import {
    Form,
    Button,
    Container,
    Icon,
    Image,
    Placeholder,
} from "semantic-ui-react";
import {Redirect, withRouter} from "react-router";
import BackendError from "../../components/BackendError";
import CommentUpload from "./CommentUpload";
import {getFromLocalStorage} from "../../helper/storage";
import {getComment, updateComment} from "../../utils/requests";
import isVideo from "../../helper/isVideo";
class EditComment extends Component{
    constructor(props) {
        super(props);
        this.state = {postId: this.props.match.params.postId,id: this.props.match.params.id,
            loading: true,comment: null,
            backendError: null, files: [],
            filesPrev: [], content: '',
           addCommentLoader: false, deletedMedia: []};
         this.uploadComment = this.uploadComment.bind(this);
    }
    componentDidMount() {
        getComment(this);
    }
    uploadComment(){
        let commentData = new FormData();
        if (this.state?.content.trim() !== '' || this.state.files.length > 0) {
                commentData.append(
                    'content',
                    this.state.content.trim()
                );
            if(this.state.files.length > 0){
                this.state.files.map(file => commentData.append('media', file))
            }
            if(this.state.deletedMedia.length > 0){
                this.state.deletedMedia.map(file => commentData.append('deletedFiles[]', file.title))
            }
            this.setState({addCommentLoader: true});
            updateComment(this, commentData);
        }
    }
    render() {
        const {loading, backendError, content, addCommentLoader, comment, deletedMedia} = this.state;
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
            {comment?.author === getFromLocalStorage('userData')?.userId &&
                <Form reply loading={addCommentLoader}>
                    <Form.TextArea value={content} onChange={e => this.setState({content: e.target.value})}/>
                    <CommentUpload _this={this} />

                        <Image.Group size='tiny'>
                            {comment?.media && comment?.media.map(media => (
                                isVideo(media.path) ? <div>
                                        <Image key={media._id} as="a" href={media.path} className={deletedMedia.indexOf(media) > -1 ? 'deleting' : ""}
                                                              target='_blank' src={'https://react.semantic-ui.com//images/image-16by9.png'} />
                                        <Icon name="remove circle" className="remove-icon" onClick={() => this.setState({deletedMedia: this.state.deletedMedia.concat(media)})}/>
                                           </div>:
                                   <div>
                                       <Image key={media._id} as="a" href={media.path} className={deletedMedia.indexOf(media) > -1 ? 'deleting' : ""}
                                           target='_blank' src={media.path} />
                                       <Icon name="remove circle" className="remove-icon" onClick={() => this.setState({deletedMedia: this.state.deletedMedia.concat(media)})}/>

                                   </div>

                                ))}
                        </Image.Group>
                    <Button content='Update Comment' disabled={addCommentLoader} secondary onClick={this.uploadComment}/>
                </Form> }

            {backendError && <BackendError error={backendError}/> }
        </Container>
    }


}
export default withRouter(EditComment);