import React, {Fragment, useState} from 'react'
import {Icon, Menu, Segment, Label, Dropdown} from 'semantic-ui-react'
import {useHistory} from "react-router";
import {getFromLocalStorage} from "../../helper/storage";
import {logout} from "../../utils/requests";
import FriendShip from "./FriendShip";
export default function Header() {
    const [activeItem, setActiveItem]  =useState('home');
    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
        if(name === 'profile'){
            history.push(`/auth/profile/${getFromLocalStorage('userData').userId}`)
        }
        else if(name === 'friendship') history.push('/auth/friend-requests');
    };
    const history = useHistory();
    const goHome = () => history.push('/');
    const signout = () => logout(goHome);
    return (
        getFromLocalStorage('userData') ?
            <Segment inverted>
                <Menu icon='labeled' inverted secondary position='right'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={handleItemClick}
                    >
                        <Icon name='home' />
                        <span className="menu-text">Home</span>
                    </Menu.Item>
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={handleItemClick}
                    >
                        <Icon name='facebook messenger' />
                        <span className="menu-text">Messages</span>
                        <Label color='red'>100</Label>
                    </Menu.Item>
                    <FriendShip name="friendship" active={activeItem === 'friendship'} handleClick={handleItemClick}/>
                    <Menu.Item
                        name='notifications'
                        active={activeItem === 'notifications'}
                        onClick={handleItemClick}
                    >
                        <Icon name='bell' />
                        <span className="menu-text">Notifications</span>
                        <Label color='red'>100</Label>

                    </Menu.Item>
                    <Menu.Menu position='right'>
                    <Dropdown item text={<Fragment>
                        <Icon name='user circle' />
                        <span className="menu-text">Profile</span>
                    </Fragment>}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Menu.Item
                                    name='profile'
                                    active={activeItem === 'profile'}
                                    onClick={handleItemClick}
                                >
                                    My Profile
                                </Menu.Item>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Menu.Item
                                    name='logout'
                                    active={activeItem === 'logout'}
                                    onClick={signout}
                                >
                                    Logout
                                </Menu.Item>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </Menu.Menu>
                </Menu>
            </Segment> : null
    )
}