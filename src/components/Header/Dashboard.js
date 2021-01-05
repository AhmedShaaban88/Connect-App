import React, {Component} from "react";
import {Icon, Label, Menu} from "semantic-ui-react";
import withToast from "../withToast";
import {withRouter} from "react-router";
import DashboardSocket from "../../publicSocket/DashboardSocket";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {new: false};
    }
    componentDidMount() {
        DashboardSocket.on('connect', () => {
            console.log('connected dashboard');
        });
        DashboardSocket.on('new-post', () => {
            this.setState({new: true});
        });
        DashboardSocket.on('seen all', (data) => {
            this.setState({new: false});
        });
    }
    componentWillUnmount() {
        DashboardSocket.disconnect();
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