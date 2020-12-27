import React, {Component} from "react";
import {Icon, Label, Menu} from "semantic-ui-react";
import io from 'socket.io-client'
import {getFromLocalStorage} from "../../helper/storage";
export default class FriendShip extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {count: 0}
    }
    componentDidMount() {
            this.socket = io('https://connect-app-v1.herokuapp.com/friends',
                { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });
            this.socket.on('connect', () => {
                 console.log('connected friends')
             });
        this.socket.on('count', (data) => {
             this.setState({count: data});
        });
    }

    //let socket = null;
    // this.socket.on('connect', () => {
    //     console.log('connected')
    // });
    // this.socket.on('count', (data) => {
    //     console.log('--------count')
    //     this.setState({count: data});
    //     // this.setState(prevState=> ({real: [...prevState.real, data]}))
    //     console.log(data)
    // })
    // useEffect(() => {

    //     return ()=> socket.disconnect();
    // },[]);
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket =null;
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
    </Menu.Item>
)
}

}