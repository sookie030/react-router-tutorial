import React from "react";
import { Route } from "react-router-dom";

import DefaultAppContainer from "./DefaultApplicationContainer";
import NotFound from "./NotFound";

class AppViewContainer extends React.Component {


  /**
   * Application View Templates...
   */
  getViewContainer() {

    let viewid = this.props.match.params.viewid;

    switch (viewid) {
      case "0":
        // default
        return (
          <React.Fragment>
            <Route
              exact
              path={this.props.match.url}
              component={DefaultAppContainer}
            />
            <Route
              path={`${this.props.match.url}/:name`}
              component={DefaultAppContainer}
            />
          </React.Fragment>
        );

      case "1":
        // default
        return (
          <React.Fragment>
            <Route
              exact
              path={this.props.match.url}
              component={DefaultAppContainer}
            />
            <Route
              path={`${this.props.match.url}/:name`}
              component={DefaultAppContainer}
            />
          </React.Fragment>
        );
      default:
        // default
        return <NotFound />;
    }
  }

  render() {
    let view = this.getViewContainer();
    return view;
  }
}
export default AppViewContainer;
