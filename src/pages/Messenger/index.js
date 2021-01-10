import React, {Component, Fragment} from "react";
import {
    Button,
    Comment,
    Container, Dimmer, Divider, Form,
    Grid,
    GridColumn,
    GridRow,
    Header, Icon, Image,
    Loader,
    Message,
    Placeholder, Segment
} from "semantic-ui-react";
import {getRoomMessages, getYourRooms, seenMessage, sendMessage} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import InfiniteScroll from "react-infinite-scroller";
import defaultAvatar from "../../assets/images/user.png";
import Moment from "react-moment";
import CommentUpload from "../Feed/CommentUpload";
import isVideo from "../../helper/isVideo";
import {getFromLocalStorage} from "../../helper/storage";
import io from 'socket.io-client';


export default class Messenger extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {
            loadingRooms: true, rooms: [],
            backendError: null,
            page: 1, total: 1, skipRoom: 0,
            currentId: props.location.state ? props.location.state : null,
            currentRoom: null,
            loadingChat: !!props.location.state, messages: [],
            moreLoader: false,
            pageMessages: 1, totalMessages: 1,skip:0,
            files: [],
            typing: null,
            filesPrev: [], content: '',
            friend: null,newMessageLoader: false,
            moreLoaderMessage: false
        };
        this.loadMoreRooms = this.loadMoreRooms.bind(this);
        this.loadMoreMessages = this.loadMoreMessages.bind(this);
        this.changeId = this.changeId.bind(this);
        this.newMessage = this.newMessage.bind(this);
        this.handleMessage = this.handleMessage.bind(this);

    }
    componentDidMount() {
        this.socket = io('https://connect-app-v1.herokuapp.com/messenger',
            { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });
        this.socket.on('connect', () => {
            console.log('connected messanger');
        });
        this.socket.on('user typing', msg => this.setState({typing: msg}));
        this.socket.on('stop user typing', msg => {
            this.setState({typing: null})
        });
        this.socket.on('room update', message => {
            const allRooms = this.state.rooms.filter(room => room._id !== message._id);
            this.setState(prevState => ({rooms: [message, ...allRooms], skipRoom: allRooms?.length > 0 ? ++prevState.skipRoom : prevState.skipRoom}));
        });
        this.socket.on('new message', message => {
            seenMessage(message._id, this);
        });

        this.socket.on('seen', ({id, user}) => {
            const message = this.state.messages.find(msg => msg._id === id);
            message.seen = user;
            this.forceUpdate();
        });
        this.socket.on('seen all', ({length, user}) => {
            const lastMessagesSeen = this.state.messages.slice(0, length);
            for(let i=0;i<lastMessagesSeen.length;i++){
                this.state.messages.find(msg => msg._id === lastMessagesSeen[i]._id).seen = user;
            }
            this.forceUpdate();
        });
        getYourRooms(this, this.state.skipRoom);
        if(this.state.currentId){
            getRoomMessages(this, this.state.currentId, this.state.skip, this.socket);
        }

    }
    loadMoreRooms = (page) => {
        if(this.state.total >= page){
            this.setState({moreLoader: true});
            getYourRooms(this, page);
        }
    };
    loadMoreMessages = (page) => {
        this.setState({moreLoaderMessage: true});
        if(this.state.totalMessages >= this.state.pageMessages && !this.state.moreLoaderMessage){
            getRoomMessages(this, this.state.currentId, this.state.skip);
        }
    };
    changeId(id){
        if(id !== this.state.currentId) {
            const skip = 0;
            getRoomMessages(this, id, skip, this.socket);
        }
    }
    handleMessage(e){
        const txt = e.target.value;
        this.setState({content: txt});
        if(txt){
            this.socket.emit('typing', this.state.currentRoom);
        }else{
            this.socket.emit('stop typing', this.state.currentRoom);

        }
    }
    newMessage(){
        let messageData = new FormData();
        if (this.state?.content.trim() !== '' || this.state.files.length > 0) {
            messageData.append(
                'content',
                this.state.content.trim() ? this.state.content.trim() : ''
            );
            if(this.state.files.length > 0){
                this.state.files.map(file => messageData.append('media', file))
            }
            this.setState({newMessageLoader: true});
            this.socket.emit('stop typing', this.state.currentRoom);
            sendMessage(this, messageData);
        }
    }
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
    }

    render() {
        const {loadingRooms, backendError, rooms, page, total, moreLoader, currentId, friend, loadingChat,
            messages,moreLoaderMessage, newMessageLoader, content, totalMessages, pageMessages, typing} = this.state;
        return <Container>
       <Grid divided={"vertically"}>
            <GridRow columns={2}>
                <GridColumn computer={6} tablet={6} mobile={16}>
                    <Header as='h3' dividing>
                        Chats
                    </Header>
                    {loadingRooms && <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line length='medium'/>
                            <Placeholder.Line length='full'/>
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length='full'/>
                            <Placeholder.Line length='medium'/>
                        </Placeholder.Paragraph>
                        <Placeholder.Header image>
                            <Placeholder.Line length='medium'/>
                            <Placeholder.Line length='full'/>
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length='full'/>
                            <Placeholder.Line length='medium'/>
                        </Placeholder.Paragraph>
                    </Placeholder>
                    }
                    <div className="lazy-parent-messages">
                        {rooms && <InfiniteScroll
                            pageStart={page}
                            loadMore={this.loadMoreRooms}
                            hasMore={total > page}
                            useWindow={false}
                        >
                            <Comment.Group>
                                {rooms?.map(room => (
                                    <Comment key={room._id} onClick={() => this.changeId(room.participants[0]._id)} className={currentId === room.participants[0]._id ? 'active-room' : ''}>
                                        <Comment.Avatar
                                            src={room.participants[0]?.avatar ? room.participants[0].avatar :  defaultAvatar}/>
                                        <Comment.Content>
                                            <Comment.Author
                                                as='a'>{
                                                room.participants[0]?.name ? room.participants[0].name : (
                                                    room.participants[0]?.email ? room.participants[0]?.email : room.participants[0].phone )
                                            }</Comment.Author>
                                            {room?.lastMessage ?<Fragment>
                                                <Comment.Text className={(room.lastMessage.sender !== getFromLocalStorage('userData').userId && room.lastMessage.seen === null ) ? 'unseen-message' : 'seen-message'}>{room.lastMessage?.content ? room.lastMessage?.content : 'Media file'}</Comment.Text>
                                                <div>
                                                    <Moment fromNow>
                                                        {new Date(room.lastMessage.delivered_at)}
                                                    </Moment>
                                                </div>
                                            </Fragment> : <Comment.Text className="seen-message">No Messages yet</Comment.Text>}


                                        </Comment.Content>
                                        <Divider />
                                    </Comment>
                                ))}
                            </Comment.Group>
                        </InfiniteScroll>
                        }
                        {moreLoader && <Loader active inline='centered'/>}
                    </div>
                    {(rooms?.length === 0 && !loadingRooms) && <Message>
                        <Message.Header>There aren't any rooms</Message.Header>
                    </Message>}
                </GridColumn>
                <GridColumn computer={10} tablet={10} mobile={16} className="messages">
                    {friend && <Header as='div' dividing>
                        <Image src={friend?.avatar ? friend?.avatar : defaultAvatar} circular/>
                        <h4 className="friend-name">{friend?.name ? friend.name : (friend?.email ? friend.email : friend?.phone)}</h4>
                        <p>{typing}</p>
                        <br/><br/>
                        {friend && <Fragment>
                            <Form reply>
                                <Form.TextArea placeholder="Enter Message" value={content} onChange={this.handleMessage}/>
                                <CommentUpload _this={this} />
                                <Button content='Send' disabled={newMessageLoader} secondary onClick={this.newMessage}/>
                            </Form>
                        </Fragment>}
                    </Header>
                    }
                    {loadingChat && <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                    </Segment>
                    }
                            <Comment.Group>
                                {messages?.map(message => (
                                    <Comment className={message?.sender === getFromLocalStorage("userData").userId ? 'you' : ''} key={message._id}>
                                        <Comment.Avatar
                                            src={message.sender !== getFromLocalStorage('userData').userId ? (friend?.avatar ? friend?.avatar :  defaultAvatar) : getFromLocalStorage('userData')?.avatar ? getFromLocalStorage('userData')?.avatar : defaultAvatar}/>
                                        <Comment.Content>
                                            <Comment.Author
                                                as='a'>{
                                                    message.sender !== getFromLocalStorage('userData').userId ?
                                                friend?.name ? friend?.name : (
                                                    friend?.email ? friend?.email : friend?.phone) : (getFromLocalStorage('userData')?.name ? getFromLocalStorage('userData')?.name : (getFromLocalStorage('userData')?.email ? getFromLocalStorage('userData')?.email : getFromLocalStorage('userData')?.phone))
                                            }</Comment.Author>
                                                <Comment.Text>{message?.content ? message?.content : <Image.Group size='tiny'>
                                                    {message?.media.map(media => (
                                                        isVideo(media.path) ? <Image key={media._id} as="a" href={media.path}
                                                                                     target='_blank'
                                                                                     src={'https://react.semantic-ui.com//images/image-16by9.png'}/> :
                                                            <Image key={media._id} as="a" href={media.path}
                                                                   target='_blank' src={media.path}/>
                                                    ))}
                                                </Image.Group>}</Comment.Text>
                                                <div>
                                                    <Moment fromNow>
                                                        {new Date(message.delivered_at)}
                                                    </Moment>
                                                    <Icon name="check" color={(message?.seen !== null && message.hasOwnProperty('seen')) ? 'blue': 'grey'} />
                                                    {message?.seen !== null}
                                                </div>


                                        </Comment.Content>
                                        <Divider />
                                    </Comment>
                                ))}
                            </Comment.Group>

                        {(totalMessages >= pageMessages && !moreLoaderMessage && messages?.length > 0) && <p className="text-center load-text" onClick={this.loadMoreMessages}>Load More Messages</p> }

                        {moreLoaderMessage && <Loader active inline='centered'/>}
                    {(messages?.length === 0 && !loadingChat && friend) && <Message>
                        <Message.Header>Say hello to your friend</Message.Header>
                    </Message>}


                </GridColumn>

            </GridRow>
           {backendError && <BackendError error={backendError}/> }
        </Grid>
        </Container>
    }
}