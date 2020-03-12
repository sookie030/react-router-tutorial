import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
// import Home from "./containers/Home";
// import About from "./containers/About";
// import Posts from "./containers/Posts";
// import Post from "./containers/Post";
import Welcome from "./containers/WelcomeContainer";
import LinkWorkspace from "./containers/LinkWorkspaceContainer";
import AppView from "./containers/TrainingContainer";

import { Router, Route } from "react-router-dom";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducer from "./redux/reducer";

import "./index.css";

const store = createStore(Reducer);

ReactDOM.render(
  <Provider store={store}>
    {/* <Router history={browserHistory}> */}
    <Router>
      <Route path="/" component={App}>
        <Route component={Welcome} />
        <Route path="linkboard" component={LinkWorkspace} />
        <Route path="app-view" component={AppView} />
        {/* <Route path="application-view" component={LinkWorkspace} /> */}
        {/* <Route path="home" component={Home} />
        <Route path="about" component={About} />
        <Route path="post" component={Posts}>
          <Route path=":id" component={Post} />
        </Route> */}
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
