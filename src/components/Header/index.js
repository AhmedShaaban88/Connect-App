import React, {Fragment, useState} from 'react'
import {Icon, Menu, Segment, Label, Dropdown} from 'semantic-ui-react'
import {useHistory} from "react-router";
import {getFromLocalStorage} from "../../helper/storage";
import {logout} from "../../utils/requests";
import FriendShip from "./FriendShip";
import Notifications from "./Notifications";
import Dashboard from "./Dashboard";
export default function Header() {
    const [activeItem, setActiveItem]  =useState('home');
    const [listShow, setListShow] = useState({
        friendShip: false,
        notifications: false
    });
    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
        if(name === 'profile'){
            history.push(`/auth/profile/${getFromLocalStorage('userData').userId}`);
            setListShow({
                friendShip: false
            });
        }else if(name === 'friendship'){
            setListShow({
                friendShip: true,
                notifications: false
            });
        }else if(name === 'home'){
            history.push(`/auth/dashboard`);
            setListShow({
                friendShip: false,
                notifications: false
            });
        }else if(name === 'notifications'){
            setListShow({
                friendShip: false,
                notifications: true
            });
        }
    };
    const checkClick = (e) => {
        const elem = e.target.tagName;
        if(elem !== 'I' && elem !== 'SPAN' && elem !== 'BUTTON'){
            setListShow({friendShip: false, notifications: false});
        }
    };
    const history = useHistory();
    const goHome = () => history.push('/');
    const signout = () => logout(goHome);
    return (
        getFromLocalStorage('userData') ?
            <Segment inverted onClick={checkClick}>
                <Menu icon='labeled' inverted secondary position='right'>
                    <Dashboard name="home" active={activeItem === 'home'} handleClick={handleItemClick}/>
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={handleItemClick}
                    >
                        <Icon name='facebook messenger' />
                        <span className="menu-text">Messages</span>
                        <Label color='red'>100</Label>
                    </Menu.Item>
                    <FriendShip name="friendship" active={listShow.friendShip === true} handleClick={handleItemClick}/>
                    <Notifications name="notifications" active={listShow.notifications === true} handleClick={handleItemClick}/>

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