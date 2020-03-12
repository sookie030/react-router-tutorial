import React, { Component } from "react";

// Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducer from "./redux/reducer";

// Components
import Welcome from "./containers/WelcomeContainer";
import LinkWorkspace from "./containers/LinkWorkspaceContainer";
import AppView from "./containers/TrainingContainer";

import Header from "./containers/HeaderContainer";

const store = createStore(Reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <div>
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/linkboard" component={LinkWorkspace} />
                <Route path={["/appview", "/appview/:viewname"]} component={AppView}/>
                {/* <Route path="/appview" component={AppView}/> */}
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
