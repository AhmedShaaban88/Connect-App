import React, {Fragment, useEffect} from "react";
import Header from "../../components/Header";
import {Route, Switch} from "react-router";
import PrivateRoute from "../../components/PrivateRoute";
import Dashboard from "../Dashboard";
import NotFound from "../NotFound";
import Profile from "../Profile";
import Comments from "../Feed/Comments";
import Likes from "../Feed/Likes";
import SearchFriends from "../SearchFriends";
import EditFeed from "../Feed/EditFeed";

export default function AuthRoutes() {
    return(
        <Fragment>
            <Header />
         <Switch>
             <PrivateRoute path="/auth/dashboard" exact component={Dashboard} />
             <PrivateRoute path="/auth/profile/:id" exact component={Profile} key={window.location.pathname}/>
             <PrivateRoute path="/auth/post/:id/comments" exact component={Comments}/>
             <PrivateRoute path="/auth/post/:postId/:id" exact component={EditFeed}/>
             <PrivateRoute path="/auth/post/:id/likes" exact component={Likes}/>
             <PrivateRoute path="/auth/search-friends" exact component={SearchFriends}/>
             <Route path="**" component={NotFound}/>
         </Switch>
        </Fragment>
    )
}