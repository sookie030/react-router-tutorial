import React, { Component } from "react";

// import Header from "./components/Header";
import Header from "./containers/HeaderContainer";

class App extends Component {
  render() {
    const location = this.props.children.props.location.pathname;
    console.log(location);
    return (
      <div>
        <Header location={location} />
        {this.props.children}
      </div>
    );
  }
}

export default App;
