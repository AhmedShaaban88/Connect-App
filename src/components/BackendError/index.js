import React from 'react'
import { Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default function BackendError({error}) {
    // all errors from backend
    return (
        typeof error === 'string' ? <Message negative>
                <p>{error}</p>
            </Message> :
        <Message
            error
            list={error}
        />
    )
}

BackendError.propTypes = {
    error: PropTypes.any,
};
