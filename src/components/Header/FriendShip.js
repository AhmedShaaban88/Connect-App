import React, {Component} from "react";
import {Icon, Image, Label, Menu} from "semantic-ui-react";
import io from 'socket.io-client';
import withToast from "../withToast";
import {getFromLocalStorage} from "../../helper/storage";
import defaultAvatar from "../../assets/images/user.png";
import {withRouter} from "react-router";
import FriendShipRequests from "../../pages/FriendShipRequests";
class FriendShip extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {count: 0, friend: null};
        this.showToast = this.showToast.bind(this);
    }
    showToast(){
        this.props.addToast(<div className="notifiy" onClick={() => this.props.history.push(`/auth/profile/${this.state.friend?._id}`)}>
            <Image src={this.state.friend?.avatar ? this.state.friend.avatar : defaultAvatar} circular inline verticalAlign="top"/>
            <div className="notify-content">
                <h4>{this.state.friend?.name}</h4>
                <p>{this.state.friend?.email ? this.state.friend.email : this.state.friend.phone}</p>
                <p>send you a friend request</p>
            </div>

        </div>, {
            appearance: 'info',
            autoDismiss: true,
            autoDismissTimeout: 5000
        });
    }
    componentDidMount() {
            this.socket = io('https://connect-app-v1.herokuapp.com/friends',
                { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });
            this.socket.on('connect', () => {
                 console.log('connected friends');
             });
        this.socket.on('count', (data) => {
             this.setState({count: data});
        });
        this.socket.on('new-friend', (data) => {
             this.setState({friend: data.recipient});
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

        <Icon name='user plus' />
        <span className="menu-text">Friends</span>
        {active && <FriendShipRequests socket={this.socket} _this={this}/>}
    </Menu.Item>
)
}

}
export default withRouter(withToast(FriendShip));