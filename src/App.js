import React, { Component } from "react";

// Router
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducer from "./redux/reducer";

// Components
import Welcome from "./containers/WelcomeContainer";
import LinkWorkspace from "./containers/LinkWorkspaceContainer";
import AppView from "./containers/AppViewContainer";
import NotFound from "./containers/NotFound";

import Header from "./containers/HeaderContainer";

const store = createStore(Reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header
              test={this.props.match}
            />
            <div>
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/linkboard" component={LinkWorkspace} />
                <Route path="/appview/:viewid" component={AppView}/>
                {/* <Route path="/appview" component={AppView}/> */}
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
