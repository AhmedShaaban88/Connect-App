import React, {Component} from "react";
import {
    Form,
    Button,
    Container,
    Icon,
    Image,
    Placeholder,
} from "semantic-ui-react";
import {withRouter} from "react-router";
import BackendError from "../../components/BackendError";
import CommentUpload from "./CommentUpload";
import {getFromLocalStorage} from "../../helper/storage";
import {getPost, updatePost} from "../../utils/requests";
import isVideo from "../../helper/isVideo";
class EditPost extends Component{
    constructor(props) {
        super(props);
        this.state = {id: this.props.match.params.id,
            loading: true,post: null,
            backendError: null, files: [],
            filesPrev: [], content: '',
           addPostLoader: false, deletedMedia: []};
         this.uploadPost = this.uploadPost.bind(this);
    }
    componentDidMount() {
        getPost(this);
    }
    uploadPost(){
        let postData = new FormData();
        if (this.state?.content.trim() !== '' || this.state.files.length > 0) {
                postData.append(
                    'content',
                    this.state.content.trim()
                );
            if(this.state.files.length > 0){
                this.state.files.map(file => postData.append('media', file))
            }
            if(this.state.deletedMedia.length > 0){
                this.state.deletedMedia.map(file => postData.append('deletedFiles[]', file.title))
            }
            this.setState({addPostLoader: true});
            updatePost(this, postData);
        }
    }
    render() {
        const {loading, backendError, content, addPostLoader, post, deletedMedia} = this.state;
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
            {(post?.author._id === getFromLocalStorage('userData')?.userId || post?.author === getFromLocalStorage('userData')?.userId) &&
                <Form reply loading={addPostLoader}>
                    <Form.TextArea value={content} onChange={e => this.setState({content: e.target.value})}/>
                    <CommentUpload _this={this} />

                        <Image.Group size='tiny'>
                            {post?.media && post?.media.map(media => (
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
                    <Button content='Update Post' disabled={addPostLoader} secondary onClick={this.uploadPost}/>
                </Form> }

            {backendError && <BackendError error={backendError}/> }
        </Container>
    }


}
export default withRouter(EditPost);