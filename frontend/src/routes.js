import React from "react";
import { Route } from "react-router-dom";

import IndexPage from "./containers/IndexPage";
import Chat from "./containers/Chat";
import AccountActivation from "./containers/AccountActivation";

const BaseRouter = () => (
  <>
     <Route exact path="/" component={IndexPage} />
     <Route exact path="/chat/:chatID" component={Chat} />
     <Route exact path="/account-activation" component={AccountActivation} />
  </>
);

export default BaseRouter;