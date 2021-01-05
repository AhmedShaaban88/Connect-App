import React, {Component, Fragment} from "react";
import {List, Image, Placeholder, Message, Loader, Icon} from "semantic-ui-react";
import {getYourNotifications} from "../../utils/requests";
import BackendError from "../../components/BackendError";
import defaultAvatar from "../../assets/images/user.png";
import InfiniteScroll from "react-infinite-scroller";
import {withRouter} from "react-router";
import Moment from "react-moment";

class AllNotifications extends Component {
constructor(props) {
        super(props);
        this.state = {loading: true, backendError: null, notifications: null, page: 1, total: 1};
        this.loadMoreNotifications = this.loadMoreNotifications.bind(this);
    }
    componentDidMount() {
        getYourNotifications(this, this.state.page);
    }
    loadMoreNotifications = (page) => {

        if(this.state.total >= page){
            getYourNotifications(this, page);
        }
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.notification !== this.state.notifications) this.props.socket.emit('seenAll');
    }

    render() {
    const {loading, notifications, backendError, page, total} = this.state;
        return  <Fragment>
            <List divided verticalAlign='middle' className="notification-list">
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
                {notifications &&
                <InfiniteScroll
                    pageStart={page}
                    loadMore={this.loadMoreNotifications}
                    hasMore={total > page}
                    loader={<Loader active inline='centered'/>}
                    className="lazy"
                    useWindow={false}
                >

                    {notifications?.map(notification => (<List.Item className="notification" key={notification._id}
                         onClick={() => {
                             switch (notification.type) {
                                 case 'friend':
                                     this.props.history.push(`/auth/profile/${notification?.by._id}`);
                                     break;
                                 case 'like':
                                     this.props.history.push(`/auth/post/${notification.post}/likes`);
                                     break;
                                 default:
                                     this.props.history.push(`/auth/post/${notification.post}/comments`);
                                     break;
                             }
                         }}>
                            <List.Content>
                                <List.Header as='p' className="text-white">
                                    <Image avatar
                                           src={notification.by?.avatar ? notification.by.avatar : defaultAvatar}/>
                                    {' '}
                                    {notification.by?.name ? notification.by.name : notification.by?.email ? notification.by.email : notification.by.phone}
                                </List.Header>
                                <List.Description className="desc-notify">
                                    {notification.type === 'friend' && <Fragment>
                                        <Icon name="user plus" color="blue"/>{' '}
                                        <span className="text-muted">accepted your friend request</span>
                                        <p className="text-white text-center">
                                            <Moment fromNow>
                                                {new Date(notification.notified_at)}
                                            </Moment>
                                        </p>
                                    </Fragment>}
                                    {notification.type === 'like' && <Fragment>
                                        <Icon name="like" color="red"/>{' '}
                                        <span className="text-muted liked">liked your post</span>
                                        <p className="text-white text-center">
                                            <Moment fromNow>
                                                {new Date(notification.notified_at)}
                                            </Moment>
                                        </p>
                                    </Fragment>}
                                    {notification.type === 'comment' && <Fragment>
                                        <Icon name="comment" color="green"/>{' '}
                                        <span className="text-muted">commented on your post</span>
                                        <p className="text-white text-center">
                                            <Moment fromNow>
                                                {new Date(notification.notified_at)}
                                            </Moment>
                                        </p>
                                    </Fragment>}

                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </InfiniteScroll>
                }


                {(notifications?.length === 0 && !loading) && <Message negative>
                    <Message.Header>We're sorry you haven't any notifications</Message.Header>
                </Message>}

                {backendError && <BackendError error={backendError}/> }

            </List>


        </Fragment>

    }
}
export default withRouter(AllNotifications);