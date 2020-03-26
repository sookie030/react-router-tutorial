import React from "react";
import { withRouter } from "react-router";
import "../assets/styles/GlobalNavigationBar.css";

// import images
import icLogo from "../assets/images/ic_logo.png";

// import constants
import * as EVENT_TYPE from "../constants/EventType";
import * as MESSAGE_TYPE from "../constants/MessageType";

// redux modules
import { connect } from "react-redux";
import { isSidebarShowing, setPipelineManager } from "../redux/actions";

import PipelineManager from "../manager/PipelineManager";

class GlobalNavigationBar extends React.Component {
  state = {
    isWelcomeView: true,
    isPipelineRunning: false
  };

  /**
   * PipelineManager 클래스 인스턴스를 생성하여
   * Reducer에 설정한다.
   */
  UNSAFE_componentWillMount() {
    let pipelineManager = new PipelineManager();

    // 파이프라인 사이클 한 번 돌았음을 알려줌
    pipelineManager.addListener(EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER, flag => {
      console.log("ONE_PIPELINE_CYCLE_IS_OVER");
      if (flag) {
        console.log("PIPELINE_RUN_OR_STOP");
        let flag = this.state.isPipelineRunning;
        this.setState(
          {
            isPipelineRunning: !flag
          },
          () => {
            this.props.pipelineManager.setIsPipelineRunning(!flag);
          }
        );
      }
      if (!this.props.isPipelineDragging) {
        this.props.onSetDummyNumber();
      }
    });

    // Toast 띄우기
    pipelineManager.addListener(
      EVENT_TYPE.POP_UP_TOAST,
      (message, messageType) => {
        this.props.onSetToast(Date.now(), message, messageType);

        if (messageType === MESSAGE_TYPE.ERROR) {
          this.setState(
            {
              isPipelineRunning: false
            },
            () => {
              this.props.pipelineManager.setIsPipelineRunning(false);
              // this.props.onIsPipelineRunning(false);
            }
          );
        }
      }
    );

    this.props.onSetPipelineManager(pipelineManager);
  }

  handleOpenView = (index, e) => {
    switch (index) {
      case 0:
        this.props.onIsSidebarShowing(!this.props.isSidebarShowing);
        break;
      case 1:
        break;
      default:
        break;
    }
  };

  render() {
    const pathname = this.props.location.pathname;
    console.log(this.props.match);
    console.log(this.props.location);
    console.log(this.props.history);
    return pathname === "/" ? (
      <div></div>
    ) : (
      <div>
        <div className={`gnb-button${pathname !== "model" ? ` selected` : ``}`} onClick={e => this.handleOpenView(e)}>
          <img src={icLogo} alt="" width="30" height="30" />
        </div>
        <div className={`gnb-button${pathname == "model" ? ` selected` : ``}`} onClick={e => this.handleOpenView(e)}>
          <img src={icLogo} alt="" width="30" height="30" />
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    isSidebarShowing: state.sidebarManager.get("isShowing"),
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onIsSidebarShowing: isShowing => dispatch(isSidebarShowing(isShowing)),
    onSetPipelineManager: pipelineManager =>
      dispatch(setPipelineManager(pipelineManager))
  };
};
GlobalNavigationBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalNavigationBar);
export default withRouter(GlobalNavigationBar);
