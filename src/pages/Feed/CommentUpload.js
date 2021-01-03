import React, { Fragment } from 'react'
import styled from 'styled-components'
import {Icon} from "semantic-ui-react";
const UploadConainer = styled(Icon)`
  position: absolute;
  z-index: 3;
  right: 0.8em;
  top: 0.9em;
  font-size: 1.3em;
`;
const RemoveIcon = styled(Icon)`
  position: absolute;
  right: 1.3em;
  cursor: pointer;
`;
const InputFiles = styled.input`
  display: none;
`;
const FilesList = styled.ul`
  list-style: none;
  padding-left: 1em;
  margin-top: 0.5em;
`;
const FileItem = styled.li`
  padding: 1em;
  border: 1px solid ${props => (props.borderColor ? 'red' : '#dddddd82')};
  margin-top: 0.5em;
  & span {
    padding-left: 0.5em;
    text-decoration: ${props => (props.borderColor ? 'line-through' : 'none')};
  }
`;
const Hint = styled.p`
  color: red;
  margin-bottom: 0;
`;
export default function CommentUpload({_this}) {
    const onFilesChange = e => {
        if (e.target.files && e.target.files.length > 0) {
            const attachments = [...e.target.files];
            let _prevFiles = [..._this.state.filesPrev,...e.target.files];
            _this.setState({
                filesPrev: _prevFiles
            });
            let correctFiles = [..._this.state.files];
            attachments.map(attachment => {
                const size = attachment.size / 1024 / 1024;
                if (size <= 4) {
                    correctFiles = correctFiles.concat(attachment);
                } else {
                    attachment.exceed = true;
                    attachment.hint = 'Max file size is 4 MB';
                }
            });
            _this.setState({files: correctFiles});
        }
    };
    const deleteFile = file => {
        if (_this.state.filesPrev.length === 1) {
            document.getElementById('upload-files').value = '';
        }
        const _filesPrev = _this.state.filesPrev.filter(_file => _file !== file);
        const _files = _this.state.files.filter(_file => _file !== file);
        _this.setState({files: _files, filesPrev: _filesPrev});
    };

    return (
        <Fragment>
            <label htmlFor="upload-files">
                <UploadConainer name={'attach'} color="black" />
            </label>
            <InputFiles
                type="file"
                accept="image/*,video/*"
                id="upload-files"
                onInput={onFilesChange}
                multiple
            />
            {_this.state.filesPrev.length > 0 && (
                <FilesList>
                    {_this.state.filesPrev.map((file, index) => (
                        <FileItem key={index} borderColor={file.exceed}>
                            <Icon name={'attach'} />
                            <span>{file.name ? file.name : file.title}</span>
                            <RemoveIcon
                                name={'remove circle'}
                                color="red"
                                onClick={() => deleteFile(file)}
                            />
                            <Hint>{file.hint}</Hint>
                        </FileItem>
                    ))}
                </FilesList>
            )}
        </Fragment>
    )
}
