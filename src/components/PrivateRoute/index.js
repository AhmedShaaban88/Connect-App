import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isAuthenticated} from "../../utils/requests";

const PrivateRoute = ({ component: Component, ...rest }) => {
    // protected routes only the authorized users
    return (
        <Route
            {...rest}
            render={routeProps =>
                isAuthenticated() ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: {
                                from: routeProps.location,
                            },
                        }}
                    />
                )
            }
        />
    )
};

export default PrivateRoute

PrivateRoute.propTypes = {
    component: PropTypes.any,
};
