import React, { Component } from 'react'
import {Icon, Menu, Segment, Label} from 'semantic-ui-react'

export default class Header extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;

        return (
            <Segment inverted>
                <Menu icon='labeled' inverted secondary position='right'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name='home' />
                        Home
                    </Menu.Item>
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name='facebook messenger' />
                        Messages
                        <Label color='red'>100</Label>
                    </Menu.Item>
                    <Menu.Item
                        name='friends'
                        active={activeItem === 'friends'}
                        onClick={this.handleItemClick}
                    >
                        <Label color='red'>100</Label>

                        <Icon name='user plus' />
                        Friends
                    </Menu.Item>
                    <Menu.Item
                        name='notifications'
                        active={activeItem === 'notifications'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name='bell' />
                        Notifications
                        <Label color='red'>100</Label>

                    </Menu.Item>
                </Menu>
            </Segment>
        )
    }
}