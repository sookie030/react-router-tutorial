import React from "react";

// redux modules
import { connect } from "react-redux";
import {
  setDummyNumber,
  isLinking,
  setLinkingPosition,
  isCtxmenuShowing,
  setCtxmenuPosition,
  setToast,
  setCtxMenuTarget,
  isPropertyNavigatorShowing
} from "../redux/actions";

// import presentational component
import Node from "../components/pipeline/Node";
import getPropertyComponent from "../manager/NodePropertyFactory";

import Link from "../components/pipeline/Link";
import Linking from "../components/pipeline/Linking";
import Pipeline from "../components/pipeline/Pipeline";

// import constants
import * as MESSAGE from "../constants/Message";
import * as MESSAGE_TYPE from "../constants/MessageType";
import * as DATA_TYPE from "../constants/DataType";
import NOT_ALLOWED_TABLE from "../constants/NotAllowedTable";

class PipelineContainer extends React.Component {
  state = {
    linkStart: null
  };

  // Canvas size (for preview)
  PREVIEW_SIZE = 200;

  /**
   * Linking 할 때, 각 노드에서 mouseover 이벤트를 받지 않고, linking중인 위치에 노드가 있는지 여부 파악하기 위한 코드.
   * 이벤트가 제대로 동작하지 않는 이슈가 있기 때문임니다 흑흑
   * @param {*} prevProps
   * @param {*} prevState
   */
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 링킹이 끝남 (prevProps 는 아직 바뀌지 않은 상태)
    if (
      prevProps.linkingPosition !== this.props.linkingPosition &&
      !this.props.isLinking
    ) {
      let fromNodeID = prevState.linkStart.nodeID;
      let toNodeID = prevProps.selectedNodeID;
      if (toNodeID !== null && prevProps.selectedPort !== null) {
        // Link 추가해주어야됨. from 노드와 to 노드가 다른 경우만 고려
        if (fromNodeID !== toNodeID) {
          // Link 가능 여부 확인
          let isValidLink = true;

          // 1. 받는 쪽이 Source인지 확인
          if (
            isValidLink &&
            prevProps.pipelineManager
              .getNodes()
              .find(node => node.getID() === toNodeID)
              .getGroup() === "Source"
          ) {
            isValidLink = false;
            prevProps.onSetToast(
              Date.now(),
              MESSAGE.LINK_TO_SOURCE,
              MESSAGE_TYPE.ERROR
            );
          }

          // 2. 유효한 Link인지 확인
          if (isValidLink) {
            let moduleName = prevProps.pipelineManager
              .getNodes()
              .find(node => node.getID() === fromNodeID)
              .getName();
            let startModuleName = prevProps.pipelineManager
              .getNodes()
              .find(node => node.getID() === toNodeID)
              .getName();

            // 같은 모듈끼리 연결하려는지 확인한다.
            if (moduleName === startModuleName) {
              isValidLink = false;
              prevProps.onSetToast(
                Date.now(),
                MESSAGE.LINK_TO_SAME_MODULE,
                MESSAGE_TYPE.ERROR
              );
            }
            // NOT_ALLOWED_TABLE에 정의하지 않은 모듈은 null이 아니라 undefined를 리턴한다.
            else if (
              NOT_ALLOWED_TABLE[startModuleName] !== undefined &&
              NOT_ALLOWED_TABLE[startModuleName].includes(moduleName)
            ) {
              isValidLink = false;
              prevProps.onSetToast(
                Date.now(),
                MESSAGE.INVALID_LINK,
                MESSAGE_TYPE.ERROR
              );
            }
          }

          // 3. Link 중복 확인
          if (isValidLink) {
            let idx = prevProps.pipelineManager
              .getLinks()
              .findIndex(
                c =>
                  (c.getIn(["from", "node"]) === fromNodeID &&
                    c.getIn(["to", "node"]) === toNodeID) ||
                  (c.getIn(["from", "node"]) === toNodeID &&
                    c.getIn(["to", "node"]) === fromNodeID)
              );
            if (idx >= 0) {
              isValidLink = false;
              prevProps.onSetToast(
                Date.now(),
                MESSAGE.LINK_ALREADY_EXIST,
                MESSAGE_TYPE.ERROR
              );
            }
          }

          // 마지막 조건까지 모두 통과 시, Link 추가
          if (isValidLink) {
            prevProps.pipelineManager.addLink(prevState.linkStart, {
              nodeID: toNodeID,
              io: "input",
              x: prevProps.selectedPort.x,
              y: prevProps.selectedPort.y,
              port: prevProps.selectedPort.port
            });
          }
        }

        // 링킹 시작 위치, selected 관련 변수 초기화
        this.setState({
          linkStart: null,
          selectedNodeID: null,
          selectedPort: null
        });
      }
    }
    return null;
  }

  /**
   * getSnapshotBeforeUpdate 다음에 항상 필요하다
   * @param {*} prevProps
   * @param {*} prevState
   * @param {*} snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    // getSnapshotBeforeUpdate에서 항상 return null을 수행하므로 아래 조건문은 수행하지 않음
    if (snapshot) {
      console.log("snapshot.. ");
    }
  }

  /**
   *  handler
   */
  handleNodeDrag = (e, data, id) => {
    if (!this.props.isLinking) {
      e.stopPropagation();
      // 이전 위치를 기준으로 얼마나 움직였는지 확인하여 모듈의 좌표값 업데이트
      this.props.pipelineManager.moveLinksByDraggingNode(
        id,
        data.deltaX,
        data.deltaY
      );

      // 파이프라인이 동작 중일 땐 수행하지 않는 이유:
      // 파이프라인 한 사이클 완료 시, onSetDummyNumber 함수를 호출하는 것이 중복됨.
      // preview (output)이 버벅거리는 이슈가 생김.
      if (!this.props.isPipelingRunning) {
        this.props.onSetDummyNumber();
      }
    }
  };

  handleNodeDragStop = (e, data, node) => {
    if (!this.props.isLinking) {
      e.stopPropagation();
      // drag 끝난 지점으로 좌표값 업데이트
      node.setPosition({
        x: data.x,
        y: data.y
      });
    }
  };

  handleNodeMouseOver = (id, e) => {
    // 링킹중 아닐 때만 이벤트 활성화
    if (!this.props.isLinking) {
      e.stopPropagation();
      this.props.onSetCtxMenuTarget(id, "node");
    }
  };

  handleNodeMouseLeave = e => {
    // 링킹중 아닐 때만 이벤트 활성화
    if (!this.props.isLinking) {
      e.stopPropagation();
      this.setState({
        selectedNodeID: null
      });
    }
  };

  /**
   * Port 위에 Link가 그려져있는 경우, Port에 MouseEvent가 전달되지 않는 문제 발생.
   * Link 위에 Event를 주어 해결
   */
  handleLinkMouseDown = e => {
    e.stopPropagation();
    if (e.button === 0) {
      // nodeID: 현재 선택된 노드의 id.
      this.setState({
        linkStart: {
          nodeID: this.props.selectedNodeID,
          io: "output",
          x: this.props.selectedPort.x,
          y: this.props.selectedPort.y,
          port: this.props.selectedPort.port
        }
      });
      this.props.onIsLinking(true);
      this.props.onSetLinkingPosition(
        this.props.selectedPort.x,
        this.props.selectedPort.y
      );
    }
  };

  /**
   * Port 위에서 마우스를 클릭. (=Link 시도)
   */
  handlePortMouseDown = e => {
    e.stopPropagation();
    if (e.button === 0) {
      let x =
        (e.target.getBoundingClientRect().left +
          e.target.getBoundingClientRect().right) /
          2 -
        this.props.linkBoardPosition.x -
        this.props.translate.x;
      let y =
        (e.target.getBoundingClientRect().top +
          e.target.getBoundingClientRect().bottom) /
          2 -
        this.props.linkBoardPosition.y -
        this.props.translate.y;

      // Number: String to Number
      let nodeID = Number(e.target.parentNode.id.split("-")[0]);

      // Port 위치정보. (top, bottom, left, right)
      let port = e.target.parentNode.id.split("-")[1];

      this.setState({
        linkStart: { nodeID: nodeID, io: "output", x: x, y: y, port: port }
      });
      this.props.onIsLinking(true);
      this.props.onSetLinkingPosition(x, y);
    }
  };

  /**
   * 그려진 Link 위에 마우스 커서가 진입하면 해당 Link 정보를 저장한다. (ContextMenu용)
   */
  handleLinkMouseOver = (id, e) => {
    e.stopPropagation();
    this.props.onSetCtxMenuTarget(id, "link");
  };

  /**
   * 그려진 Link 위에 마우스 커서가 빠져나가면 저장되어있던 Link 정보를 초기화한다.
   */
  handleLinkMouseLeave = e => {
    e.stopPropagation();
    this.props.onSetCtxMenuTarget(null, null);
  };

  /**
   * 오르쪽 마우스 클릭 이벤트 (ContextMenu용)
   */
  handleMouseDown = e => {
    if (e.button === 2) {
      e.stopPropagation();
      // 여기서는 pipeline의 translate를 고려할 필요가 없다.
      this.props.onSetCtxmenuPosition(
        e.clientX - this.props.linkBoardPosition.x,
        e.clientY - this.props.linkBoardPosition.y
      );
      this.props.onIsCtxmenuShowing(true);
    } else if (e.button === 0 && this.props.isCtxMenuShowing === true) {
      this.props.onIsCtxmenuShowing(false);
    }
  };

  /**
   * Preview 버튼 이벤트
   */
  handlePreviewMouseDown = (node, e) => {
    e.stopPropagation();
    if (e.button === 0) {
      const selectedNodeID = node.getIsPreviewing();

      if (!node.getIsPreviewing()) {
        node.setIsPreviewing(true);
        console.log(node.getIsPreviewing());

        // Node height 늘이기
        node.setSize({
          width: node.getSize()["width"],
          height: node.getSize()["height"] + this.PREVIEW_SIZE
        });

        // 연결된 Path들의 좌표값 변경
        this.props.pipelineManager.moveLinksByResizingNode(
          node.getID(),
          0,
          this.PREVIEW_SIZE
        );
      } else {
        node.setIsPreviewing(false);

        // Node height 줄이기
        node.setSize({
          width: node.getSize()["width"],
          height: node.getSize()["height"] - this.PREVIEW_SIZE
        });

        // 연결된 Path들의 좌표값 변경
        this.props.pipelineManager.moveLinksByResizingNode(
          node.getID(),
          0,
          -this.PREVIEW_SIZE
        );
      }

      // 파이프라인이 동작 중일 땐 수행하지 않는 이유:
      // 파이프라인 한 사이클 완료 시, onSetDummyNumber 함수를 호출하는 것이 중복됨.
      // preview (output)이 버벅거리는 이슈가 생김.
      if (!this.props.isPipelingRunning) {
        this.props.onSetDummyNumber();
      }
    }
  };

  handleNodeClick = (node, e) => {
    e.stopPropagation();
    console.log("show node property navigator");
    this.props.onIsPropertyNavigatorShowing(true, node);
  };

  getOutput = node => {
    let moduleDataChunk = node.getOutput();
    let output = null;

    if (moduleDataChunk !== null) {
      let outputList = moduleDataChunk.getModuleDataList();

      // 우선 첫 번째 output만 고려한다.
      output = outputList[0];
      let outputdata = output.getData();

      switch (output.getType()) {
        case DATA_TYPE.IMAGE:          // imageData 반환
        console.log(outputdata);
        console.log(outputdata.data);
          return outputdata;
        default:
          return null;
      }
    }

    return output;
  };

  /**
   * Node 그리기
   */
  getNodeList = () => {
    const PROP_SPACE_Y = 30;
    const INIT_NODE_HEIGHT = 100;

    let list = this.props.pipelineManager.getNodes().map(node => {
      const propertyCompopent = getPropertyComponent(node);
      
      if (propertyCompopent.length > 0) {
        // true면 preview 하고있다는 의미.
        const isShowingPreview = node.getIsPreviewing();
        const nodeHeight = node.getSize()["height"];
        const lastPropertyHeight =
          propertyCompopent[propertyCompopent.length - 1].y +
          propertyCompopent[propertyCompopent.length - 1].height;

        if (lastPropertyHeight + PROP_SPACE_Y > nodeHeight) {
          // Node height 늘이기
          node.setSize({
            width: node.getSize()["width"],
            height: lastPropertyHeight + PROP_SPACE_Y
          });
        } else {
          // Pipeline 진행과정 보여주기. Height 크게, 모듈에 맞는 Output 뿌리기
          if (isShowingPreview) {
            if (
              nodeHeight > INIT_NODE_HEIGHT &&
              lastPropertyHeight + PROP_SPACE_Y < nodeHeight - this.PREVIEW_SIZE
            ) {
              // Node height 줄이기
              node.setSize({
                width: node.getSize()["width"],
                height: Math.max(
                  lastPropertyHeight + PROP_SPACE_Y,
                  INIT_NODE_HEIGHT
                )
              });
            }
          } else {
            if (
              nodeHeight > INIT_NODE_HEIGHT &&
              lastPropertyHeight + PROP_SPACE_Y < nodeHeight
            ) {
              // Node height 줄이기
              node.setSize({
                width: node.getSize()["width"],
                height: Math.max(
                  lastPropertyHeight + PROP_SPACE_Y,
                  INIT_NODE_HEIGHT
                )
              });
            }
          }
        }
      }
      let preview = node.getIsPreviewing();
      let output = preview ? this.getOutput(node) : null;
      return (
        <Node
          // node
          key={node.getID()}
          node={node}
          propertyCompopent={propertyCompopent}
          // selected node
          selectedNodeID={this.props.selectedNodeID}
          // handlers
          handleNodeDrag={(e, data) =>
            this.handleNodeDrag(e, data, node.getID())
          }
          handleNodeDragStop={(e, data) =>
            this.handleNodeDragStop(e, data, node)
          }
          handleNodeMouseOver={e => this.handleNodeMouseOver(node.getID(), e)}
          handleNodeMouseLeave={e => this.handleNodeMouseLeave(e)}
          handleMouseDown={e => this.handleMouseDown(e)}
          handlePortMouseDown={e => this.handlePortMouseDown(e)}
          handlePreviewMouseDown={e => this.handlePreviewMouseDown(node, e)}
          handleNodeClick={e => this.handleNodeClick(node, e)}
          // preview
          preview={preview}
          output={output}
        />
      );
    });
    return list;
  };

  /**
   * Link 그리기
   */
  getLinkList = () => {
    // 이미 완성된 path
    let list = [];

    this.props.pipelineManager.getLinks().forEach((link, i) => {
      let linkElement = (
        <Link
          key={i}
          link={link}
          handleMouseDown={e => this.handleMouseDown(e)}
          handleLinkMouseOver={e => this.handleLinkMouseOver(link.get("id"), e)}
          handleLinkMouseLeave={e => this.handleLinkMouseLeave(e)}
          selectedlinkID={
            this.props.ctxMenuTarget.get("type") === "link"
              ? this.props.ctxMenuTarget.get("id")
              : null
          }
          handleLinkMouseDown={e => this.handleLinkMouseDown(e)}
        ></Link>
      );
      list.push(linkElement);
    });

    // 그리는 중인 path
    if (this.props.isLinking) {
      let linkElement = (
        <Linking
          key="drawing"
          linkStart={this.state.linkStart}
          linkingPosition={this.props.linkingPosition}
        />
      );
      list.push(linkElement);
    }
    return list;
  };

  /**
   * render
   */
  render() {
    const translateX = this.props.translate.x;
    const translateY = this.props.translate.y;
    const nodeList = this.getNodeList();
    const linkList = this.getLinkList();
    return (
      <React.Fragment>
        <Pipeline
          translateX={translateX}
          translateY={translateY}
          nodeList={nodeList}
          linkList={linkList}
        />
        {this.props.dummyNumber}
      </React.Fragment>
    );
  }
}

let mapStateToProps = state => {
  return {
    pipelineManager: state.pipelineManager.get("pipelineManager"),
    isPipelingRunning: state.pipelineManager.get("isRunning"),
    dummyNumber: state.pipelineManager.get("dummyNumber"),
    selectedNode: state.nodesManager.get("selectedNode"),
    isLinking: state.linksManager.get("isLinking"),
    linkingPosition: state.linksManager.get("linkingPosition"),
    isCtxMenuShowing: state.ctxMenuManager.get("isShowing"),
    ctxMenuTarget: state.ctxMenuManager.get("target")
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetDummyNumber: () => dispatch(setDummyNumber()),
    onIsLinking: mouseIsDown => dispatch(isLinking(mouseIsDown)),
    onSetLinkingPosition: (x, y) => dispatch(setLinkingPosition(x, y)),
    onIsCtxmenuShowing: isShowing => dispatch(isCtxmenuShowing(isShowing)),
    onSetCtxmenuPosition: (x, y) => dispatch(setCtxmenuPosition(x, y)),
    onSetCtxMenuTarget: (targetID, menuType) =>
      dispatch(setCtxMenuTarget(targetID, menuType)),
    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType)),
    onIsPropertyNavigatorShowing: (isShowing, selectedNode) =>
      dispatch(isPropertyNavigatorShowing(isShowing, selectedNode))
  };
};

PipelineContainer = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
})(PipelineContainer);
export default PipelineContainer;
