import React, {Fragment} from "react";
import Header from "../../components/Header";
import {Route, Switch} from "react-router";
import PrivateRoute from "../../components/PrivateRoute";
import Dashboard from "../Dashboard";
import NotFound from "../NotFound";
import Profile from "../Profile";

export default function AuthRoutes() {
    return(
        <Fragment>
            <Header />
         <Switch>
             <PrivateRoute path="/auth/dashboard" exact component={Dashboard} />
             <PrivateRoute path="/auth/profile/:id" exact component={Profile} />
             <Route path="**" component={NotFound}/>
         </Switch>
        </Fragment>
    )
}