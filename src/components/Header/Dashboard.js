import React, {Component} from "react";
import {Icon, Image, Label, Menu} from "semantic-ui-react";
import io from 'socket.io-client';
import withToast from "../withToast";
import {getFromLocalStorage} from "../../helper/storage";
import defaultAvatar from "../../assets/images/user.png";
import {withRouter} from "react-router";
import FriendShipRequests from "../../pages/FriendShipRequests";
import DashboardPage from "../../pages/Dashboard";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {new: false, post: null};
    }
    componentDidMount() {
        this.socket = io('https://connect-app-v1.herokuapp.com/dashboard',
            { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });
        this.socket.on('connect', () => {
            console.log('connected dashboard');
        });
        this.socket.on('new-post', (data) => {
            this.setState({post: data, new: true});
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
                {this.state.new && <Label circular empty size="tiny" color='red'/>}
                <Icon name='home' />
                <span className="menu-text">Home</span>
            </Menu.Item>
        )
    }

}
export default withRouter(withToast(Dashboard));