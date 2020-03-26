import React from "react";
import "../assets/styles/Tab.css";

// redux modules
import { connect } from "react-redux";
import { setToast } from "../redux/actions";

class TabContainer extends React.Component {

  openTab = e => {
    console.log(e);
  };

  closeTab = e => {
    console.log(e);
  };
  
  render() {
    return (
      <div className="tab-area">
        <div className="tabs">
          <div className="tab selected" onClick={e => this.openTab(e)}>
            <span className="tabname">First</span>
            <button className="tabclose" onClick={e => this.closeTab(e)}>
              X
            </button>
          </div>
          <div className="tab" onClick={e => this.openTab(e)}>
            <span className="tabname">B</span>
            <button className="tabclose" onClick={e => this.closeTab(e)}>
              X
            </button>
          </div>
          <div className="tab" onClick={e => this.openTab(e)}>
            <span className="tabname">Hi</span>
            <button className="tabclose" onClick={e => this.closeTab(e)}>
              X
            </button>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    links: state.linksManager.get("links"),
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType))
  };
};

TabContainer = connect(mapStateToProps, mapDispatchToProps)(TabContainer);
export default TabContainer;
