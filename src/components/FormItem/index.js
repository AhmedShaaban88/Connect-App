import React from "react";
import propTypes from 'prop-types';
import {Form} from "react-bootstrap";
import styled from "styled-components";
const Control = styled(Form.Control)`
  background: rgba(241, 241, 241, .7);
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  border: 0;
  color: #3E3E3E;
`;
const FeedBack = styled(Form.Control.Feedback)`
    display: block;
    text-align: left;
  `;
export default function FormItem({id, title, type, input,inputError, onChange, error}) {
    // generic component for form controls
    return(
        <Form.Group>
            <Form.Label>{title}</Form.Label>
            <Control value={input} id={id} type={type} isInvalid={input?.length && inputError} onChange={onChange}/>
            {input && inputError && (
                <FeedBack type="invalid">{error}</FeedBack>
            )}
        </Form.Group>
    )
}
FormItem.propTypes = {
    id: propTypes.string,
    title: propTypes.string,
    type: propTypes.string,
    input: propTypes.any,
    inputError: propTypes.any,
    onChange: propTypes.func,
    error: propTypes.string
};