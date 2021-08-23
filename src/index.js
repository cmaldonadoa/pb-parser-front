import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import RulesManager from "./manager/rules-management";
import ModelValidator from "./manager/model-validator";
import "./index.scss";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/upload">
        <ModelValidator />
      </Route>
      <Route path="/">
        <RulesManager />
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);
