import React from 'react';

import '../assets/styles/linkboard.css';

// redux module
import { connect } from 'react-redux';
import {
  isLinking,
  setLinkingPosition,
  isCtxmenuShowing,
  selectModule,
  isPipelineDragging,
} from '../redux/actions';

// load component
import Pipeline from './PipelineContainer';
import ContextMenu from './ContextMenuContainer';

class LinkboardContainer extends React.Component {
  // render 함수 내 ref로 직접 접근한다. linkBoard의 좌표값 구하기 위해서 사용한다.
  linkBoardRef = React.createRef();
  pipelineRef = React.createRef();
  buttonRef = React.createRef();

  state = {
    dragOverPosition: null,
    linkBoardPosition: { x: 0, y: 0 },

    selectedNodeID: null,
    selectedPort: null,

    // pipeline move
    isMouseDown: false,
    mouseDownStartPosition: { x: 0, y: 0 },
    prevPipelineTranslate: { x: 0, y: 0 },
    nextPipelineTranslate: { x: 0, y: 0 },
  };

  componentDidMount() {
    // 웹에서 확인할 때, 우측 마우스 클릭 시 기본 컨텍스트메뉴 보이지 않도록 추가
    document.oncontextmenu = e => {
      e.preventDefault();
    };

    this.setState({
      linkBoardPosition: {
        x: this.linkBoardRef.getBoundingClientRect().left,
        y: this.linkBoardRef.getBoundingClientRect().top,
      },
    });
  }

  handleMouseMove = e => {
    e.stopPropagation();

    // linkBoard 전체를 move 할 때엔 pipeline translate를 신경쓰지 않는다.
    var x = e.clientX - this.state.linkBoardPosition.x;
    var y = e.clientY - this.state.linkBoardPosition.y;

    // pipeline 전체 이동을 위한 드래그
    if (this.state.isMouseDown === true) {
      // sidebar에서 선택한 모듈이 있다면 선택 해제
      if (this.props.selectedModule) {
        this.props.onSelectModule(null);
      }

      // pipeline 전체를 이동시킨다.
      this.setState({
        nextPipelineTranslate: {
          x:
            this.state.prevPipelineTranslate.x +
            x -
            this.state.mouseDownStartPosition.x,
          y:
            this.state.prevPipelineTranslate.y +
            y -
            this.state.mouseDownStartPosition.y,
        },
      });
    } else {
      // linkBoard move 외 mouse move 이벤트에서는 pipeline translate를 고려해준다.
      x = x - this.state.nextPipelineTranslate.x;
      y = y - this.state.nextPipelineTranslate.y;

      // Linking중일 때만 (Path 만드는 중)
      if (this.props.isLinking === true) {
        this.props.onSetLinkingPosition(x, y);
      }

      // 현재 마우스커서 위치가 노드 위에 있는지 확인 (겹쳐져있다면 더 상위에 있는 노드 선택)
      var selectedNode = this.props.pipelineManager // .nodes
        .getNodes()
        .reverse()
        .find(
          node =>
            node.getPosition()['x'] - 10 < x &&
            x < node.getPosition()['x'] + node.getSize()['width'] + 10 &&
            node.getPosition()['y'] - 10 < y &&
            y < node.getPosition()['y'] + node.getSize()['height'] + 10,
        );

      // 노드에 마우스오버 중
      if (selectedNode) {
        // 마우스커서가 포트 위에 있다면 해당 포트 위치 찾기
        var portX = null;
        var portY = null;
        var port = null;

        // Cursor가 Port 위에 있는지 확인
        if (
          selectedNode.getPosition()['x'] +
            selectedNode.getSize()['width'] / 2 -
            10 <
            x &&
          x <
            selectedNode.getPosition()['x'] +
              selectedNode.getSize()['width'] / 2 +
              10 &&
          selectedNode.getPosition()['y'] - 10 < y &&
          y < selectedNode.getPosition()['y'] + 10
        ) {
          // console.log('top')
          portX =
            selectedNode.getPosition()['x'] +
            selectedNode.getSize()['width'] / 2;
          portY = selectedNode.getPosition()['y'];
          port = 'top';
        } else if (
          selectedNode.getPosition()['x'] +
            selectedNode.getSize()['width'] / 2 -
            10 <
            x &&
          x <
            selectedNode.getPosition()['x'] +
              selectedNode.getSize()['width'] / 2 +
              10 &&
          selectedNode.getPosition()['y'] +
            selectedNode.getSize()['height'] -
            10 <
            y &&
          y <
            selectedNode.getPosition()['y'] +
              selectedNode.getSize()['height'] +
              10
        ) {
          // console.log('bottom')
          portX =
            selectedNode.getPosition()['x'] +
            selectedNode.getSize()['width'] / 2;
          portY =
            selectedNode.getPosition()['y'] + selectedNode.getSize()['height'];
          port = 'bottom';
        } else if (
          selectedNode.getPosition()['x'] - 10 < x &&
          x < selectedNode.getPosition()['x'] + 10 &&
          selectedNode.getPosition()['y'] +
            selectedNode.getSize()['height'] / 2 -
            10 <
            y &&
          y <
            selectedNode.getPosition()['y'] +
              selectedNode.getSize()['height'] / 2 +
              10
        ) {
          // console.log('left')
          portX = selectedNode.getPosition()['x'];
          portY =
            selectedNode.getPosition()['y'] +
            selectedNode.getSize()['height'] / 2;
          port = 'left';
        } else if (
          selectedNode.getPosition()['x'] +
            selectedNode.getSize()['width'] -
            10 <
            x &&
          x <
            selectedNode.getPosition()['x'] +
              selectedNode.getSize()['width'] +
              10 &&
          selectedNode.getPosition()['y'] +
            selectedNode.getSize()['height'] / 2 -
            10 <
            y &&
          y <
            selectedNode.getPosition()['y'] +
              selectedNode.getSize()['height'] / 2 +
              10
        ) {
          // console.log('right')
          portX =
            selectedNode.getPosition()['x'] + selectedNode.getSize()['width'];
          portY =
            selectedNode.getPosition()['y'] +
            selectedNode.getSize()['height'] / 2;
          port = 'right';
        } else {
          portX = null;
          portY = null;
          port = null;
        }

        // 조건문 없이 setState를 반복하면 render 함수를 계속 call. 버벅거림.
        // 커서 위치가 노드에서 다른 노드로 이동 || port에서 !port로 || port에서 다른 port로 이동 시에만 setState
        if (
          this.state.selectedNodeID !== selectedNode.getID() ||
          (this.state.selectedPort === null && port !== null) ||
          (this.state.selectedPort !== null &&
            this.state.selectedPort.port !== port)
        ) {
          this.setState({
            selectedNodeID: Number(selectedNode.getID()),
            selectedPort:
              portX === null && portY === null
                ? null
                : { x: portX, y: portY, port: port },
          });
        }

        // 마우스 커서 변경
        if (this.state.selectedPort !== null) {
          // 마우스가 포트 위에 있으면 손가락모양
          e.target.style.cursor = 'pointer';
        } else {
          if (
            selectedNode.getPosition()['x'] +
              selectedNode.getSize()['width'] / 2 -
              10 <
              x &&
            x <
              selectedNode.getPosition()['x'] +
                selectedNode.getSize()['width'] / 2 +
                10 &&
            selectedNode.getPosition()['y'] +
              selectedNode.getSize()['height'] -
              20 <
              y &&
            y <
              selectedNode.getPosition()['y'] +
                selectedNode.getSize()['height'] -
                10
          ) {
            // preview 버튼 위에 있음
            e.target.style.cursor = 'pointer';
          } else {
            // 마우스가 포트 외 노드 내에 있으면 십자 모양
            e.target.style.cursor = 'move';
          }
        }
      } else {
        // 마우스커서가 노드 바깥에 있음

        // 조건문 없이 setState를 반복하면 render 함수를 계속 call. 버벅거림.
        if (this.state.selectedNodeID !== null) {
          this.setState({
            selectedNodeID: null,
            selectedPort: null,
          });
        }

        // 마우스 커서 변경
        e.target.style.cursor = 'default';
      }
    }
  };

  handleMouseUp = e => {
    e.stopPropagation();

    // sorket에서 mouseup 하면 false가 중복된다.
    if (this.props.isLinking === true) {
      this.props.onIsLinking(false);
      this.props.onSetLinkingPosition(null, null);
    }

    // Add Node
    if (this.props.selectedModule !== null) {
      let name = this.props.selectedModule.name;
      let group = this.props.selectedModule.group;
      let position = {
        x:
          e.clientX -
          this.state.linkBoardPosition.x -
          this.state.nextPipelineTranslate.x -
          100,
        y:
          e.clientY -
          this.state.linkBoardPosition.y -
          this.state.nextPipelineTranslate.y -
          25,
      };
      this.props.pipelineManager.addNode(name, group, position);
      this.props.onSelectModule(null);
    }

    this.setState({
      isMouseDown: false,
      mouseDownStartPosition: { x: 0, y: 0 },
      prevPipelineTranslate: this.state.nextPipelineTranslate,
    });
  };

  handleMouseDown = e => {
    e.stopPropagation();
    if (this.props.isCtxMenuShowing) this.props.onIsShowing(false);

    // 현재 마우스커서 위치가 노드 위에 있는지 확인
    var x =
      e.clientX -
      this.state.linkBoardPosition.x -
      this.state.nextPipelineTranslate.x;
    var y =
      e.clientY -
      this.state.linkBoardPosition.y -
      this.state.nextPipelineTranslate.y;

    var selectedNode = this.props.pipelineManager
      .getNodes()
      .find(
        node =>
          node.getPosition()['x'] - 10 < x &&
          x < node.getPosition()['x'] + node.getSize()['width'] + 10 &&
          node.getPosition()['y'] - 10 < y &&
          y < node.getPosition()['y'] + node.getSize()['height'] + 10,
      );

    // 노드 외 영역일 때만 isMouseDown = true (linkboard 이동을 위함)
    // mouseDownStartPosition에는 다시 pipeline의 translate값을 더해준다.
    // 드래그 할 좌표값도 pipeline의 translate를 고려하지 않기 때문에 조건을 동일하게 맞춰야한다.
    // (handleMouseMove 참고)
    if (!selectedNode) {
      this.setState({
        isMouseDown: true,
        mouseDownStartPosition: {
          x: x + this.state.nextPipelineTranslate.x,
          y: y + this.state.nextPipelineTranslate.y,
        },
      });
    }
  };

  handleDragOver = e => {
    e.preventDefault();
  };

  handleDrop = e => {
    var module = e.dataTransfer.getData('module');

    if (module !== null && module !== '') {
      let name = this.props.selectedModule.name;
      let group = this.props.selectedModule.group;
      let position = {
        x:
          e.clientX -
          this.state.linkBoardPosition.x -
          this.state.nextPipelineTranslate.x -
          100,
        y:
          e.clientY -
          this.state.linkBoardPosition.y -
          this.state.nextPipelineTranslate.y -
          25,
      };

      this.props.pipelineManager.addNode(name, group, position);
    }
    this.props.onSelectModule(null);
  };

  render() {
    return (
      <React.Fragment>
        <svg
          id="linkboard"
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseUp={e => this.handleMouseUp(e)}
          onMouseDown={e => this.handleMouseDown(e)}
          onDragOver={e => this.handleDragOver(e)}
          onDrop={e => this.handleDrop(e)}
          ref={r => {
            this.linkBoardRef = r;
          }}
        >
          <Pipeline
            linkBoardPosition={this.state.linkBoardPosition}
            selectedNodeID={this.state.selectedNodeID}
            selectedPort={this.state.selectedPort}
            translate={this.state.nextPipelineTranslate}
            ref={r => {
              this.pipelineRef = r;
            }}
          />
        </svg>

        <ContextMenu
          targetID={this.props.ctxMenuTarget.get('id')}
          type={this.props.ctxMenuTarget.get('type')}
        />
      </React.Fragment>
    );
  }
}

let mapStateToProps = state => {
  return {
    links: state.linksManager.get('links'),
    isLinking: state.linksManager.get('isLinking'),
    isCtxMenuShowing: state.ctxMenuManager.get('isShowing'),
    selectedModule: state.nodesManager.get('selectedModule'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
    isPipelineDragging: state.pipelineManager.get('isDragging'),

    // 20.02.07 ctxmenu test
    ctxMenuTarget: state.ctxMenuManager.get('target'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onIsLinking: mouseIsDown => dispatch(isLinking(mouseIsDown)),
    onSetLinkingPosition: (x, y) => dispatch(setLinkingPosition(x, y)),
    onIsShowing: isShowing => dispatch(isCtxmenuShowing(isShowing)),
    onSelectModule: module => dispatch(selectModule(module)),
    onIsPipelineDragging: isDragging =>
      dispatch(isPipelineDragging(isDragging)),
  };
};

LinkboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LinkboardContainer);
export default LinkboardContainer;
