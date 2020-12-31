import React, {Component, Fragment} from "react";
import {Icon, Image, Label, List, Menu} from "semantic-ui-react";
import io from 'socket.io-client';
import withToast from "../withToast";
import {getFromLocalStorage} from "../../helper/storage";
import {withRouter} from "react-router";
import defaultAvatar from "../../assets/images/user.png";
import AllNotifications from "../../pages/AllNotifications";
class Notifications extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {count: 0, notification: null};
        this.showToast = this.showToast.bind(this);
    }
    showToast(){
        this.props.addToast(<div className="notifiy" onClick={() => {
            switch (this.state.notification?.type) {
                case 'friend':
                    this.props.history.push(`/auth/profile/${this.state.notification?.by._id}`);
                    this.socket.emit('seen', this.state.notification?._id);
                    break;
                case 'like':
                    this.props.history.push(`/auth/post/${this.state.notification?.post}/likes`);
                    this.socket.emit('seen', this.state.notification?._id);
                    break;
                default:
                    this.props.history.push(`/auth/post/${this.state.notification?.post}/comments`);
                    this.socket.emit('seen', this.state.notification?._id);
                    break;
            }
        }}>
            <Image src={this.state.notification?.by.avatar ? this.state.notification?.by.avatar : defaultAvatar} circular inline verticalAlign="top"/>
            <div className="notify-content">
                <h4>    {this.state.notification?.by.name ? this.state.notification?.by.name :
                    (this.state.notification?.by.email ? this.state.notification?.by.email : this.state.notification?.by.phone)}
                </h4>

                {this.state.notification?.type === 'friend' && <Fragment>
                    <Icon name="user plus" color="blue"/>{' '}
                    <span className="text-muted">accepted your friend request</span>
                </Fragment>}
                {this.state.notification?.type === 'like' && <Fragment>
                    <Icon name="like" color="red"/>{' '}
                    <span className="text-muted liked">liked your post</span>
                </Fragment>}
                {this.state.notification?.type === 'comment' && <Fragment>
                    <Icon name="comment" color="green"/>{' '}
                    <span className="text-muted">commented on your post</span>
                </Fragment>}
            </div>
        </div>, {
            appearance: 'info',
            autoDismiss: true,
            autoDismissTimeout: 5000
        });
    }
    componentDidMount() {
            this.socket = io('https://connect-app-v1.herokuapp.com/notifications',
                { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });
            this.socket.on('connect', () => {
                 console.log('connected notifications');
             });
        this.socket.on('count', (data) => {
             this.setState({count: data});
        });
        this.socket.on('notification', (data) => {
             this.setState({notification: data});
            this.showToast();
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
    }

    render(){
    const {name, handleClick, active} = this.props;

    return(
    <Menu.Item
        name={name}
        active={active}
        onClick={handleClick}
    >
        {this.state.count > 0 && <Label color='red'>{this.state.count}</Label>}

        <Icon name='bell' />
        <span className="menu-text">Notifications</span>
        {active && <AllNotifications socket={this.socket} _this={this}/>}
    </Menu.Item>
)
}

}
export default withRouter(withToast(Notifications));