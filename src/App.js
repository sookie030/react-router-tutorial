import React, { Component } from "react";

// Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducer from "./redux/reducer";

// css
import "./assets/css/common.css";
import "./assets/css/board.css";
import "./assets/css/module.css";
import "./assets/css/popup.css";

// Components
import Welcome from "./containers/WelcomeContainer";
import LinkWorkspace from "./containers/LinkWorkspaceContainer";
import AppView from "./containers/AppViewContainer";
import NotFound from "./containers/NotFound";

import Header from "./containers/HeaderContainer";
import Sidebar from "./containers/SidebarContainer";
import Workspace from "./containers/WorkspaceContainer";

const store = createStore(Reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <Header />

            <main>
              <Sidebar />
              <Workspace />
            </main>

            {/* <div>
              <Switch>
                <Route exact path="/" component={Welcome} />
              </Switch>
            </div> */}
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
