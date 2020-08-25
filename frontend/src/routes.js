import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PublicRoute from './PublicRoute';

import Chat from "./containers/Chat";
import AccountActivation from "./containers/AccountActivation";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Dialogs from "./containers/Dialogs";
import Settings from "./containers/Settings";
import MyPage from "./containers/MyPage";
import News from "./containers/News";
import Friends from "./containers/Friends";
import Teams from "./containers/Teams";

const BaseRouter = ({ isAuth }) => {

  return (
    <>
      {
        isAuth ? (
          <Switch>
            <Route path="/dialogs" component={Dialogs} exact />
            <Route path="/my_page" component={MyPage} />
            <Route path="/news" component={News} />
            <Route path="/friends" component={Friends} />
            <Route path="/teams" component={Teams} />
            <Route path="/settings" component={Settings} />
            <Route path="/dialogs/:chatID" component={Chat} />
            <Route path="/account-activation" component={AccountActivation} />
            <Redirect to="/dialogs" />
          </Switch >)
          : (
            <Switch>
              <PublicRoute path="/" component={Login} exact />
              <PublicRoute path="/register" component={Register} />
              <PublicRoute path="/account-activation" component={AccountActivation} />
              <Redirect to="/" />
            </Switch>
          )
      }
    </>
  );
}

export default BaseRouter;