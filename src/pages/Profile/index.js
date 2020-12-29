import React, {useState} from "react";
import {Menu} from "semantic-ui-react";
import InfoPage from "./InfoPage";
import Posts from "./Posts";
import Friends from "./Friends";

export default function Profile(props) {
    const [activeItem, setActiveItem]  =useState('info');
    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };
    return             <div>
        <Menu pointing secondary>
            <Menu.Item
                name='info'
                active={activeItem === 'info'}
                onClick={handleItemClick}
            />
            <Menu.Item
                name='posts'
                active={activeItem === 'posts'}
                onClick={handleItemClick}
            />
            <Menu.Item
                name='friends'
                active={activeItem === 'friends'}
                onClick={handleItemClick}
            />
        </Menu>
        {activeItem === 'info' && <InfoPage/>}
        {activeItem === 'posts' && <Posts/>}
        {activeItem === 'friends' && <Friends/>}
    </div>

}