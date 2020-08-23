import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';
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

const BaseRouter = () => {

  const isAuthenticated = useSelector(state => !!state.auth.token);

  let routes = (
    <>
      <PublicRoute exact path="/" component={Login} />
      <PublicRoute exact path="/register" component={Register} />
      <PublicRoute exact path="/account-activation" component={AccountActivation} />
      <Redirect to={"/"} />
    </>
  )

  if (isAuthenticated) {
    routes = (
      <>
        <Route exact path="/my_page" component={MyPage} />
        <Route exact path="/news" component={News} />
        <Route exact path="/dialogs" component={Dialogs} />
        <Route exact path="/friends" component={Friends} />
        <Route exact path="/teams" component={Teams} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/dialogs/:chatID" component={Chat} />
        <Route exact path="/account-activation" component={AccountActivation} />
        <Redirect exact to={"/dialogs"} />
      </>
    )
  }

  return (
    routes
  );
}

export default BaseRouter;