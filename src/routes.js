// src/routes.js
import React from "react";
import { Router, Route, IndexRoute } from "react-router";

import App from "./components/App";
import Upload from "./components/Upload";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="/about" component={About} />
      <Route path="/upload" component={Upload} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="*" component={Home} />
    </Route>
  </Router>
);

export default Routes;