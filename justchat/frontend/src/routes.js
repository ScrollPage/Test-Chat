import React from "react";
import { Route } from "react-router-dom";

import Chat from "./containers/Chat";

const BaseRouter = () => (
  <>
     <Route exact path="/:chatID/" component={Chat} />
  </>
);

export default BaseRouter;