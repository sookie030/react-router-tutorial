import React from "react";

// import constants
import * as EVENT_TYPE from "../constants/EventType";
import { MESSAGE_TYPE } from "../constants/Message";

// redux modules
import { connect } from "react-redux";
import {
  setPipelineManager,
  setDummyNumber,
  setToast,
  isLinking,
  setLinkingPosition,
  isCtxmenuShowing,
  selectModule,
  isPipelineDragging,
} from "../redux/actions";

// import container
import ModuleList from "./ModuleListContainer";
import Pipeline from "./PipelineContainer";

// import pipelineManager
import PipelineManager from "../manager/PipelineManager";
import { closeSync } from "fs";

class WorkspaceContainer extends React.Component {

  workspaceRef = React.createRef();

  state = {
    isWelcomeView: false,
    selectedDpl: 0,
  };

  componentDidMount() {
    let pipelineManager = new PipelineManager();

    // 파이프라인 사이클 한 번 돌았음을 알려줌
    pipelineManager.addListener(
      EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER,
      (flag) => {
        console.log("ONE_PIPELINE_CYCLE_IS_OVER");
        if (flag) {
          console.log("PIPELINE_RUN_OR_STOP");
          let flag = this.state.isPipelineRunning;
          this.setState(
            {
              isPipelineRunning: !flag,
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

    this.props.onSetPipelineManager(pipelineManager);
  }

  handleChangeDpl = (e) => {
    this.setState({
      selectedDpl: e.target.value,
    });
  };

  handleMouseMove = (e) => {
    e.stopPropagation();
  };

  handleMouseUp = (e) => {
    e.stopPropagation();
  };

  handleMouseDown = (e) => {
    e.stopPropagation();
  };

  handleDragOver = (e) => {
    e.preventDefault();
  };

  handleDrop = (e) => {
    let droppedModuleName = e.dataTransfer.getData("module");

    if (droppedModuleName !== null && droppedModuleName !== "") {
      let moduleName = this.props.selectedModule.name;
      let groupName = this.props.selectedModule.group;
      let position = {
        x: e.clientX - this.workspaceRef.getBoundingClientRect().left - 149,
        y: e.clientY - this.workspaceRef.getBoundingClientRect().top - 20,
      };

      this.props.pipelineManager.addNode(moduleName, groupName, position);
    }
    this.props.onSelectModule(null);
    this.props.onSetDummyNumber();
  };

  render() {
    return (
      <section>
        <ModuleList />
        <div className="runlist">
          <div className="custom-select">
            <select
              value={this.state.selectedDpl}
              onChange={this.handleChangeDpl}
            >
              <option value="0">Image training.dpl</option>
              <option value="1">Image training.dpl</option>
              <option value="2">Grid detection.dpl</option>
              <option value="3">UI Template</option>
            </select>
          </div>
          <a href="#">
            <span>Run</span>
          </a>
        </div>
        <div className="board">
          <div className="tab" style={{ clear: "both" }}>
            <ul>
              <li className="acttab">
                <a href="#">
                  Welcome<span></span>
                </a>
              </li>
              <li>
                <a href="#">
                  facerecognition.dpl<span></span>
                </a>
              </li>
              <li>
                <a href="#">
                  detection.dpl<span></span>
                </a>
              </li>
            </ul>
          </div>

          <div
            className="workspace"
            onMouseMove={(e) => this.handleMouseMove(e)}
            onMouseUp={(e) => this.handleMouseUp(e)}
            onMouseDown={(e) => this.handleMouseDown(e)}
            onDragOver={(e) => this.handleDragOver(e)}
            onDrop={(e) => this.handleDrop(e)}
            ref={r => {
              this.workspaceRef = r;
            }}
          >
            <div id="moduleboard">
              <Pipeline />
            </div>
            <div className="modelingbtn">
              <a href="#"></a>
            </div>
            {/* <!-- properties 띄우려고 만든 체크박스임, 워크보드 하단에 있는 체크박스. 제어가능하면 <input ..>삭제하거나 hidden 해주면 됨. 참고는 board.html의 19줄의 체크박스 활용한거임 (좌측 모듈리스트)--></input ..> */}
            {/* <input type="checkbox" id="menu-button" /> */}
            <div className="properties">
              <p className="title">
                Properties<span className="rightbtn close"></span>
              </p>
              <hr />
              <div className="properties_contents">
                {/* <!-- 저장할때는 클래스명 modify를 save로 바꿈-->  */}
                <p className="modulename">
                  Regin Of interest<span className="rightbtn modify"></span>
                </p>
                <div className="option">
                  <p className="optionname">Area</p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Position X
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                      // onChange={props.handleOnChange}
                    />
                    <br />
                    <label htmlFor="">Position Y</label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
                <hr />
                <div className="option">
                  <p className="optionname"></p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Width
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                    />
                    <br />
                    <label htmlFor="">Height</label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
                <hr />
                <div className="option">
                  <p className="optionname"></p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Color
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="state">
          {/* <!-- 진행상황 보여주는 파란색 bar--> */}
          <div className="bar"></div>
          {/* <!--활성화시 div에 act클래스 추가--> */}
          <div className="processing">
            <p>
              Camera Processing...<span>14/30</span>
            </p>
          </div>
        </div>
      </section>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    links: state.linksManager.get("links"),
    pipelineManager: state.pipelineManager.get("pipelineManager"),
    isPipelineDragging: state.pipelineManager.get("isDragging"),

    isLinking: state.linksManager.get("isLinking"),
    isCtxMenuShowing: state.ctxMenuManager.get("isShowing"),
    selectedModule: state.nodesManager.get("selectedModule"),

    // 20.02.07 ctxmenu test
    ctxMenuTarget: state.ctxMenuManager.get("target"),
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onSetPipelineManager: (pipelineManager) =>
      dispatch(setPipelineManager(pipelineManager)),
    onSetDummyNumber: () => dispatch(setDummyNumber()),

    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType)),

    onIsLinking: (mouseIsDown) => dispatch(isLinking(mouseIsDown)),
    onSetLinkingPosition: (x, y) => dispatch(setLinkingPosition(x, y)),
    onIsShowing: (isShowing) => dispatch(isCtxmenuShowing(isShowing)),
    onSelectModule: (module) => dispatch(selectModule(module)),
    onIsPipelineDragging: (isDragging) =>
      dispatch(isPipelineDragging(isDragging)),
  };
};

WorkspaceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceContainer);
export default WorkspaceContainer;
