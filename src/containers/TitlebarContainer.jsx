import React from 'react';
import '../assets/styles/titlebar.css';
import icLogo from '../assets/images/ic_logo.png';

// import constants
import * as EVENT_TYPE from '../constants/EventType';
import * as MESSAGE_TYPE from '../constants/MessageType';

// redux modules
import { connect } from 'react-redux';
import {
  setPipelineManager,
  setDummyNumber,
  setToast,
} from '../redux/actions';

import PipelineManager from '../manager/PipelineManager';

class TitlebarContainer extends React.Component {
  state = {
    isPipelineRunning: false,
  };

  /**
   * PipelineManager 클래스 인스턴스를 생성하여
   * Reducer에 설정한다.
   */
  UNSAFE_componentWillMount() {
    let pipelineManager = new PipelineManager();

    // 파이프라인 사이클 한 번 돌았음을 알려줌
    pipelineManager.addListener(
      EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER,
      flag => {
        console.log('ONE_PIPELINE_CYCLE_IS_OVER');
        if (flag) {
          console.log('PIPELINE_RUN_OR_STOP');
          let flag = this.state.isPipelineRunning;
          this.setState(
            {
              isPipelineRunning: !flag,
            },
            () => {
              this.props.pipelineManager.setIsPipelineRunning(!flag);
            },
          );
        }
        if (!this.props.isPipelineDragging) {
          this.props.onSetDummyNumber();
        }
      },
    );

    // 파이프라인 실행/중단
    // pipelineManager.addListener(EVENT_TYPE.PIPELINE_RUN_OR_STOP, () => {
    //   console.log('PIPELINE_RUN_OR_STOP');
    //   let flag = this.state.isPipelineRunning;
    //   this.setState(
    //     {
    //       isPipelineRunning: !flag,
    //     },
    //     () => {
    //       this.props.pipelineManager.setIsPipelineRunning(!flag);
    //       // this.props.onIsPipelineRunning(!flag);
    //     },
    //   );
    // });

    // Toast 띄우기
    pipelineManager.addListener(
      EVENT_TYPE.POP_UP_TOAST,
      (message, messageType) => {
        this.props.onSetToast(Date.now(), message, messageType);

        if (messageType === MESSAGE_TYPE.ERROR) {
          this.setState(
            {
              isPipelineRunning: false,
            },
            () => {
              this.props.pipelineManager.setIsPipelineRunning(false);
              // this.props.onIsPipelineRunning(false);
            },
          );
        }
      },
    );

    this.props.onSetPipelineManager(pipelineManager);
  }

  /**
   * Pipeline 실행
   */
  handleClickRunBtn = e => {
    let flag = this.state.isPipelineRunning;
    this.setState(
      {
        isPipelineRunning: !flag,
      },
      () => {
        this.props.pipelineManager.setIsPipelineRunning(!flag);
        // this.props.onIsPipelineRunning(!flag);
      },
    );
  };

  render() {
    return (
      <div id="titlebar">
        <img src={icLogo} alt="logo" width="32" height="32" />
        <div className="title-area">
          <div>
            <span id="title">Knowledge Studio</span>
          </div>
          <div>
            <span id="sub-title">Version 2.0 beta</span>
          </div>
        </div>
        <div className="button-area">
          <div id="btn-run" onMouseUp={this.handleClickRunBtn}>
            {this.state.isPipelineRunning === true ? 'STOP' : 'RUN'}
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    links: state.linksManager.get('links'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
    isPipelineDragging: state.pipelineManager.get('isDragging'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetPipelineManager: pipelineManager =>
      dispatch(setPipelineManager(pipelineManager)),
    // onIsPipelineRunning: isRunning => dispatch(isPipelineRunning(isRunning)),
    onSetDummyNumber: () => dispatch(setDummyNumber()),

    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType)),
  };
};

TitlebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitlebarContainer);
export default TitlebarContainer;
