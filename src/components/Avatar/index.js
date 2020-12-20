import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import imageReader from '../../helper/imageReader'
import { useToasts } from 'react-toast-notifications'

const UploadButton = styled.input`
  display: block;
  box-sizing: border-box;
  height: 2.75em;
  width: 9em;
  border: 1px solid #00b5ad;
  border-radius: 5px;
  background: #ffffff;
  margin-bottom: 1.5em;
  padding-top: 0.9em;
  padding-bottom: 0.8em;
  opacity: 0;
  position: absolute;
  z-index: -1;
  &:hover {
    background-color: white;
    border-color: #00b5ad;
  }
`;
const Text = styled.label`
  color: #00b5ad;
  font-size: 0.875em;
  line-height: 1em;
  text-align: center;
  display: block;
  box-sizing: border-box;
  height: 2.75em;
  width: 9em;
  border: 1px solid #00b5ad;
  border-radius: 5px;
  background: #ffffff;
  margin-bottom: 1.5em;
  padding-top: 0.9em;
  padding-bottom: 0.8em;
  cursor: pointer;
`;
export default function Avatar({ setPhoto, setAvatarPrev }) {
    const { addToast } = useToasts();

    const onFileChange = async e => {
        // read image and only accept 0.5 mb for image size
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const size = file.size / 1024 / 1024;
            if (size <= 0.5) {
                let imageDataUrl = await imageReader(file);
                setAvatarPrev(imageDataUrl);
                setPhoto({
                    avatar: file,
                });
            } else {
                setPhoto({
                    avatar: '',
                });
                addToast('Image exceed 0.5 MB', {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        }
    };

    return (
        <div className="App">
            <Text htmlFor="upload-photo">Upload avatar</Text>
            <UploadButton
                type="file"
                accept="image/*"
                onChange={onFileChange}
                id="upload-photo"
            />
        </div>
    )
}
Avatar.propTypes = {
    setPhoto: PropTypes.func,
    setAvatarPrev: PropTypes.func,
};
