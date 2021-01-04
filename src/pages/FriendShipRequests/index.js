import React, {Component, Fragment} from "react";
import {List, Image, Button, Placeholder, Message, Loader} from "semantic-ui-react";
import {getYourFriendRequests, friendAcceptReject} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import InfiniteScroll from "react-infinite-scroller";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

class FriendShipRequests extends Component {
constructor(props) {
        super(props);
        this.state = {loading: true, backendError: null, requests: null, page: 1, total: 1,skip: 0,
            friendLoadingItem: null, friendAcceptItems: [], friendRejectItems: []};
        this.loadMoreFriends = this.loadMoreFriends.bind(this);
        this.friendActionFunc = this.friendActionFunc.bind(this);
    }
    componentDidMount() {
        getYourFriendRequests(this, this.props._this);
    }
    loadMoreFriends = (page) => {
        if(this.state.total >= page){
            getYourFriendRequests(this);
        }
    };
    friendActionFunc = (e,id, type) => {
        this.setState({friendLoadingItem: id});
        friendAcceptReject(type,id,this,this.minusCount);
    };
    minusCount = () => this.props.socket.emit('decrease-count');
    render() {
    const {loading, requests, backendError, page, total, friendLoadingItem, friendAcceptItems, friendRejectItems} = this.state;
        return  <Fragment>
            <List divided verticalAlign='middle'>
                {loading && <Placeholder inverted>
                    <Placeholder.Header image>
                        <Placeholder.Line length='medium' />
                        <Placeholder.Line length='full' />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder.Paragraph>
                    <Placeholder.Header image>
                        <Placeholder.Line length='medium' />
                        <Placeholder.Line length='full' />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder.Paragraph>
                </Placeholder>}
                {requests &&  <InfiniteScroll
                    pageStart={page}
                    loadMore={this.loadMoreFriends}
                    hasMore={total > page}
                    loader={<Loader active inline='centered' />}
                    className="lazy"
                    useWindow={false}
                >
                    {requests.map(friend => (<List.Item key={friend._id}>
                    <Image avatar src={friend.recipient?.avatar ? friend.recipient.avatar : defaultAvatar} onClick={() => this.props.history.push(`/auth/profile/${friend?.recipient._id}`)}/>
                    <List.Content onClick={() => this.props.history.push(`/auth/profile/${friend?.recipient._id}`)}>
                        <p>{friend.recipient?.name ? friend.recipient.name : ''}</p>
                        <p>{friend.recipient?.email ? friend.recipient.email : friend.recipient.phone}</p>
                    </List.Content>
                    <List.Content floated='right'>
                        {friendAcceptItems?.indexOf(friend.recipient._id) <= -1 && friendRejectItems?.indexOf(friend.recipient._id) <= -1 &&  <Button.Group>
                            <Button negative disabled={friendLoadingItem === friend.recipient._id} loading={friendLoadingItem === friend.recipient._id} onClick={e => this.friendActionFunc(e,friend.recipient._id,'remove')}>Reject</Button>
                            <Button.Or/>
                            <Button positive disabled={friendLoadingItem === friend.recipient._id} loading={friendLoadingItem === friend.recipient._id} onClick={e => this.friendActionFunc(e,friend.recipient._id,'accept')}>Accept</Button>
                        </Button.Group>}

                        {friendAcceptItems?.indexOf(friend.recipient._id) > -1 &&  <Message color="green" size="mini">
                            <Message.Header>you have accepted friend request</Message.Header>
                        </Message>}
                        { friendRejectItems?.indexOf(friend.recipient._id) > -1 && <Message color="red" size="mini">
                            <Message.Header>you have reject friend request</Message.Header>
                        </Message>}

                    </List.Content>
                </List.Item>))}
                </InfiniteScroll>
                    }

                {(requests?.length === 0 && !loading) && <Message negative>
                    <Message.Header>We're sorry you haven't any friend requests <Link to="/auth/search-friends">Search</Link></Message.Header>
                </Message>}

                {backendError && <BackendError error={backendError}/> }

            </List>


        </Fragment>

    }
}
export default withRouter(FriendShipRequests);