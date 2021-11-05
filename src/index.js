import { ConfigProvider } from "antd";
import esES from "antd/lib/calendar/locale/es_ES";
import jwt_decode from "jwt-decode";
import Login from "pages/Login";
import Manager from "pages/Manager";
import Rules from "pages/Manager/Rules";
import RuleForm from "pages/Manager/Rules/Form";
import AdminTenders from "pages/Manager/Tenders";
import TendersForm from "pages/Manager/Tenders/Form";
import Reviewer from "pages/Reviewer";
import ModelValidator from "pages/Reviewer/Validation";
import ReviewerTenders from "pages/Reviewer/Tenders";
import TendersView from "pages/Reviewer/Tenders/Form";
import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./index.less";

const Site = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [loading, setLoading] = useState(true);

  const redirect = useCallback(() => {
    try {
      const jwt = sessionStorage.getItem("auth");
      const decoded = jwt_decode(jwt);

      if (decoded.role === "ADMIN") setIsAdmin(true);

      if (decoded.role === "REVIEWER") setIsReviewer(true);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [setIsAdmin, setIsReviewer]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  if (loading) return null;
  return (
    <ConfigProvider locale={esES}>
      <Router>
        <Switch>
          <Route path="/reviewer/validate">
            {!isReviewer ? <Redirect to="/" /> : <ModelValidator />}
          </Route>
          <Route path="/reviewer/tenders/view">
            {!isReviewer ? <Redirect to="/" /> : <TendersView />}
          </Route>
          <Route path="/reviewer/tenders">
            {!isReviewer ? <Redirect to="/" /> : <ReviewerTenders />}
          </Route>
          <Route path="/reviewer">
            {!isReviewer ? <Redirect to="/" /> : <Reviewer />}
          </Route>
          <Route path="/manager/rules/edit">
            {!isAdmin ? <Redirect to="/" /> : <RuleForm />}
          </Route>
          <Route path="/manager/rules/new">
            {!isAdmin ? <Redirect to="/" /> : <RuleForm />}
          </Route>
          <Route path="/manager/rules">
            {!isAdmin ? <Redirect to="/" /> : <Rules />}
          </Route>
          <Route path="/manager/tenders/edit">
            {!isAdmin ? <Redirect to="/" /> : <TendersForm />}
          </Route>
          <Route path="/manager/tenders/new">
            {!isAdmin ? <Redirect to="/" /> : <TendersForm />}
          </Route>
          <Route path="/manager/tenders">
            {!isAdmin ? <Redirect to="/" /> : <AdminTenders />}
          </Route>
          <Route path="/manager">
            {!isAdmin ? <Redirect to="/" /> : <Manager />}
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  );
};

ReactDOM.render(<Site />, document.getElementById("root"));
