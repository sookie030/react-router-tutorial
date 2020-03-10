import React from "react";
import { Link } from "react-router";
import "../assets/styles/Header.css";

// test
import icLogo from "../assets/images/ic_logo.png";

// import constants
import * as EVENT_TYPE from "../constants/EventType";
import * as MESSAGE_TYPE from "../constants/MessageType";

// redux modules
import { connect } from "react-redux";
import { setPipelineManager, setDummyNumber, setToast } from "../redux/actions";

import PipelineManager from "../manager/PipelineManager";

// const Header = props => {
class Header extends React.Component {
  state = {
    isPipelineRunning: false
  };

  /**
   * PipelineManager 클래스 인스턴스를 생성하여
   * Reducer에 설정한다.
   */
  UNSAFE_componentWillMount() {
    let pipelineManager = new PipelineManager();

    // 파이프라인 사이클 한 번 돌았음을 알려줌
    pipelineManager.setEventHandler(
      EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER,
      flag => {
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
      }
    );

    // Toast 띄우기
    pipelineManager.setEventHandler(
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
    console.log("setpipeline");
  }

  /**
   * Pipeline 실행
   */
  handleClickRunBtn = e => {
    let flag = this.state.isPipelineRunning;
    this.setState(
      {
        isPipelineRunning: !flag
      },
      () => {
        this.props.pipelineManager.setIsPipelineRunning(!flag);
        // this.props.onIsPipelineRunning(!flag);
      }
    );
  };

  render() {
    return (
      <div className="header-area">
        <div className="header-text-area">
          <p className="header-text">Knowledge Studio 2.0</p>
        </div>
        <div className="header-button-area">
          <div className="header-button" onMouseUp={this.handleClickRunBtn}>
            {this.state.isPipelineRunning === true ? "STOP" : "RUN"}
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    links: state.linksManager.get("links"),
    pipelineManager: state.pipelineManager.get("pipelineManager"),
    isPipelineDragging: state.pipelineManager.get("isDragging")
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetPipelineManager: pipelineManager =>
      dispatch(setPipelineManager(pipelineManager)),
    onSetDummyNumber: () => dispatch(setDummyNumber()),

    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType))
  };
};
Header = connect(mapStateToProps, mapDispatchToProps)(Header);
export default Header;
