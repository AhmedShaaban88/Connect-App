import React, { Fragment } from 'react'
import styled from 'styled-components'
import {Image} from "semantic-ui-react";
import PropTypes from 'prop-types'


const PrevImage = styled(Image)`
  border: 1px solid #dadada;
  filter: brightness(0.5);
  margin-bottom: 2em;
`;
const RemovePrev = styled.span`
  position: absolute;
  right: 25px;
  top: 235px;
  cursor: pointer;
  font-size: 1.5em;
  color: white;
`;

export default function PreviewAvatar({ image, setAvatarPrev, setAvatar, prev=false }) {
    const removeImage = e => {
        setAvatarPrev(null);
        document.getElementById('upload-photo').value = '';
        setAvatar({
            avatar: '',
        })
    };
    return (
        prev ? <Image src={image} size='medium' circular />:
        <Fragment>
            <PrevImage src={image} fluid />
            <RemovePrev onClick={removeImage}>x</RemovePrev>
        </Fragment>
    )
}
PreviewAvatar.propTypes = {
    image: PropTypes.string,
    setAvatarPrev: PropTypes.func,
    setAvatar: PropTypes.func,
    prev: PropTypes.bool
};
