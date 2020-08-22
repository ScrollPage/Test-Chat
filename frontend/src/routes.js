import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';

import IndexPage from "./containers/IndexPage";
import Chat from "./containers/Chat";
import AccountActivation from "./containers/AccountActivation";

const BaseRouter = () => {

  const isAuthenticated = useSelector(state => state.auth.token !== null);

  let routes = (
    <>
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/account-activation" component={AccountActivation} />
      <Redirect to={"/"} />
    </>
  )

  if (isAuthenticated) {
    routes = (
      <>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/chat/:chatID" component={Chat} />
        <Route exact path="/account-activation" component={AccountActivation} />
        <Redirect to={"/"} />
      </>
    )
  }

  return (
    routes
  );
}

export default BaseRouter;