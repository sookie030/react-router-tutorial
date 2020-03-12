import React from "react";

import DefaultAppContainer from "./DefaultApplicationContainer";
import NotFound from "./NotFound";

class AppViewContainer extends React.Component {

  getViewContainer() {
    console.log(this.props.match)
    let viewname = this.props.match.params.viewname;
    console.log(viewname);
    switch(viewname) {
      case '0':
        // default
        return <DefaultAppContainer/>;
      default:
        // default
        return <NotFound/>;

    }
  }

  render() {
    let view = this.getViewContainer();
    return view;
  }
}
export default AppViewContainer;