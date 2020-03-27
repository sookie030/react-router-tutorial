import React, { Component } from "react";
import "./App.css";

// Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducer from "./redux/reducer";

// Components
import Tab from "./containers/TabContainer";
import Sidebar from "./containers/SidebarContainer";

import Titlebar from "./containers/TitlebarContainer";
import Welcome from "./containers/WelcomeContainer";
import LinkWorkspace from "./containers/LinkWorkspaceContainer";
import AppView from "./containers/AppViewContainer";
import NotFound from "./containers/NotFound";

import GlobalNavigationBar from "./containers/GlobalNavigationBarContainer";

const store = createStore(Reducer);

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div className="titlebar-area">
              <Titlebar />
            </div>
            <div className="gnb-area">
              <GlobalNavigationBar />
            </div>

            {/* <div className="sidebar-area">
              <Sidebar />
            </div> */}

            <div className="view-area">
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/linkboard" component={LinkWorkspace} />
                <Route path="/appview/:viewid" component={AppView} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
