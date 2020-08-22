import React from "react";
import { Route } from "react-router-dom";

import Chat from "./containers/Chat";
import AccountActivation from "./containers/AccountActivation";

const BaseRouter = () => (
  <>
     <Route exact path="/:chatID/" component={Chat} />
     <Route exact path="/account-activation" component={AccountActivation} />
  </>
);

export default BaseRouter;