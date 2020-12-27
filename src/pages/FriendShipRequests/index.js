import React, {Component} from "react";

export default class FriendShipRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, backendError: null, requests: null, page: 1, total: 1};
    }
    render() {
        return <h1>hello</h1>
    }
}