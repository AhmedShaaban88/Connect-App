import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import PropTypes from 'prop-types'
export default function Status({active, setInput}) {
    //active or inactive status for form
    return(
        <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
                Status
            </Form.Label>
            <Col sm={10} className="mt-1">
                <Form.Check
                    type="radio"
                    label="Active"
                    name="status"
                    id="active"
                    inline
                    checked={active === true}
                    onChange={e => setInput({active: true})}
                />
                <Form.Check
                    type="radio"
                    label="In Active"
                    name="status"
                    id="inactive"
                    inline
                    checked={active === false}
                    onChange={e => setInput({active: false})}
                />
            </Col>
        </Form.Group>
    )
}
Status.propTypes = {
    active: PropTypes.bool,
    setInput: PropTypes.func
};