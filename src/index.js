import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications'
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import AuthRoutes from "./pages/AuthRoutes";


ReactDOM.render(
    <ToastProvider>
    <Router>

        <Switch>
            <PublicRoute path="/" exact component={Login} />
            <PublicRoute path="/verify-code" exact component={VerifyCode} />
            <PublicRoute path="/reset-password" exact component={ResetPassword} />
            <PublicRoute path="/forget-password" exact component={ForgetPassword} />
            <PublicRoute path="/register" component={Register} />
            <Route path="/auth" component={AuthRoutes} />
            <Route path="**" component={NotFound}/>
       </Switch>
    </Router>
    </ToastProvider>
    ,
    document.getElementById('root'));

