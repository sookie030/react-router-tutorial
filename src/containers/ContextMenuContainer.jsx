import React from 'react';

// redux module
import { connect } from 'react-redux';
import {
  removeLink,
  isCtxmenuShowing,
} from '../redux/actions';

// import presentational component
import ContextMenu from '../components/ContextMenu';

class ContextMenuContainer extends React.Component {
  state = {
    display: 'none',
    id: null,
  };

  // nodeMenuItems = ['Setting', 'Remove'];

  nodeMenuItems = ['Remove'];
  linkMenuItems = ['Remove'];

  // 오른쪽마우스가 눌리지 않으면 업데이트 할 필요가 없다.
  // 노드 혹은 연결부분에 마우스 오버할 때마다 render가 실행되는 것을 막기 위해 추가.
  shouldComponentUpdate(nextProps, nextState) {
    var shouldUpdate =
      this.props.position !== nextProps.position ||
      this.props.isShowing !== nextProps.isShowing;

    // MouseUp되면 targetID === null로 초기화되어서 기억해두기 위해 추가.
    if (shouldUpdate && this.props.targetID !== null) {
      this.setState({
        id: this.props.targetID,
      });
    }

    return shouldUpdate;
  }

  handleMouseDown = e => {
    e.stopPropagation();
  };

  handleMouseUp = e => {
    e.stopPropagation();
    if (e.button === 0) {
      var item = e.target.parentNode.childNodes[1].textContent;

      switch (item) {
        case 'Remove':
          if (this.props.type === 'node') {
            this.props.pipelineManager.removeNode(this.state.id);
            this.props.pipelineManager.removeLinksByRemovingNode(this.state.id);
          } else {
            this.props.pipelineManager.removeLink(this.state.id);
          }
          break;

        case 'Setting':
          this.props.onIsShowing(true, this.state.id);
          break;
        default:
          break;
      }

      this.props.onIsCtxmenuShowing(false);
    }
  };

  handleMouseEnter = e => {
    e.stopPropagation();
    e.target.parentNode.childNodes[0].style.fill = 'rgb(70, 128, 255)';
  };

  handleMouseLeave = e => {
    e.stopPropagation();
    e.target.parentNode.childNodes[0].style.fill = 'rgb(240, 240, 240)';
  };

  getMenuItems = () => {
    var menuItems =
      this.props.type === 'node' ? this.nodeMenuItems : this.linkMenuItems;
    var menuItemElements = menuItems.map((item, i) => {
      const element = (
        <g
          key={i}
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseUp={e => this.handleMouseUp(e)}
          onMouseEnter={e => this.handleMouseEnter(e)}
          onMouseLeave={e => this.handleMouseLeave(e)}
        >
          <rect className="contextmenu-item" x="0" y={5 + 30 * i}></rect>
          <text className="contextmenu-text" x="10" y={20 + 30 * i}>
            {item}
          </text>
        </g>
      );
      return element;
    });

    return menuItemElements;
  };

  render() {
    const onGetMenuItems = this.getMenuItems();
    return (
      <ContextMenu
        isShowing={this.props.isShowing}
        position={this.props.position}
        getMenuItems={onGetMenuItems}
      ></ContextMenu>
    );
  }
}

let mapStateToProps = state => {
  return {
    isShowing: state.ctxMenuManager.get('isShowing'),
    position: state.ctxMenuManager.get('position'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onRemoveLink: (deletedElement, id) =>
      dispatch(removeLink(deletedElement, id)),

    onIsCtxmenuShowing: isShowing => dispatch(isCtxmenuShowing(isShowing)),
  };
};

ContextMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContextMenuContainer);
export default ContextMenuContainer;
