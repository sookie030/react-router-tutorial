import React from "react";
import { withRouter } from "react-router";
import "../assets/css/common.css";

// import constants
import * as EVENT_TYPE from "../constants/EventType";
import { MESSAGE_TYPE } from "../constants/Message";

// redux modules
import { connect } from "react-redux";
import { setPipelineManager, setDummyNumber, setToast } from "../redux/actions";

import Header from "../components/Header";

// const Header = props => {
class HeaderContainer extends React.Component {
  state = {
    isPipelineRunning: false,
  };

  
  render() {
    return (
      <Header/ >
    );
  }
}

let mapStateToProps = (state) => {
  return {
    links: state.linksManager.get("links"),
    pipelineManager: state.pipelineManager.get("pipelineManager"),
    isPipelineDragging: state.pipelineManager.get("isDragging"),
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onSetPipelineManager: (pipelineManager) =>
      dispatch(setPipelineManager(pipelineManager)),
    onSetDummyNumber: () => dispatch(setDummyNumber()),

    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType)),
  };
};
HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
export default withRouter(HeaderContainer);
