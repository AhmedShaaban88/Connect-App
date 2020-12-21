import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isAuthenticated} from "../../utils/requests";

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={routeProps =>
                !isAuthenticated() ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/auth/dashboard',
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

export default PublicRoute

PublicRoute.propTypes = {
    component: PropTypes.any,
};
