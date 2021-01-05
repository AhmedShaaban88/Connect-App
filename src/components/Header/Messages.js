import React, {Component} from "react";
import {Icon, Label, Menu} from "semantic-ui-react";
import withToast from "../withToast";
import {withRouter} from "react-router";
import MessagesSocket from "../../publicSocket/MessagesSocket";

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {count: null};
    }
    componentDidMount() {
        MessagesSocket.on('connect', () => {
            console.log('connected messages');
        });
        MessagesSocket.on('count', count => {
            this.setState({count: count});
        });
    }

    componentWillUnmount() {
        MessagesSocket.disconnect();
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
                <Icon name='facebook messenger' />
                <span className="menu-text">Messages</span>
            </Menu.Item>
        )
    }

}
export default withRouter(withToast(Messages));