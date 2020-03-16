import React from "react";
import "../assets/styles/training.css";

import { plain2immutable } from "../utils/plain2immutable";
import * as PROP_TYPE from "../constants/PropertyType";

// redux modules
import { connect } from "react-redux";

class DefaultApplicationModelContainer extends React.Component {

  render() {
    return (
      <div className="model-view-container">
        <div><p>X</p></div>
        <h1>Model view</h1>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {
  };
};

DefaultApplicationModelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultApplicationModelContainer);
export default DefaultApplicationModelContainer;
