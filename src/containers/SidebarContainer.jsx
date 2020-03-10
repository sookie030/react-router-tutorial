import React from 'react';

// redux modules
import { connect } from 'react-redux';
import { selectModule } from '../redux/actions';

// import presentational component
import Sidebar from '../components/Sidebar';

// import constants
import MODULE_LIST from '../constants/module/ModuleList';

class SidebarContainer extends React.Component {
  state = {
    sidebarWidth: 250,
    groupWidth: 100,

    selectedGroupId: 0,
    selectedModuleId: null,
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedGroupId !== nextState.selectedGroupId) {
      // 사이드바 > 카테고리 변경 시, Module id 초기화
      this.setState({
        selectedModuleId: null,
      });
      this.props.onSelectModule(null);
    } else if (this.state.sidebarWidth !== nextState.sidebarWidth) {
      // 사이드바 닫으면 모두 초기화
      this.setState({
        selectedModuleId: null,
      });
      this.props.onSelectModule(null);
    } else if (
      this.state.selectedModuleId !== null &&
      nextProps.selectedModule === null
    ) {
      // 클릭 & 클릭으로 모듈 추가 시, Module id 초기화
      this.setState({
        selectedModuleId: null,
      });
    }
  }

  /**
   *  handler
   */
  handleMouseDown = e => {
    e.stopPropagation();
  };

  handleMouseUp = (type, id, e) => {
    e.stopPropagation();

    // 카테고리 선택 (Source, Filter, Detector ...)
    if (type === 'group') {
      if (this.state.selectedGroupId === id) {
        this.setState({
          selectedGroupId: null,
          sidebarWidth: 100,
        });
      } else {
        this.setState({
          selectedGroupId: id,
          sidebarWidth: 250,
        });
      }

      // 모듈 선택 (Camera, Face Camera ...)
    } else if (type === 'module') {
      this.setState({
        selectedModuleId: id,
      });
      var group = Object.keys(MODULE_LIST)[this.state.selectedGroupId];
      this.props.onSelectModule({ group: group, name: MODULE_LIST[group][id] });

      // 그 외 사이드바 여백 클릭 시, 모듈 선택 초기화
    } else {
      this.setState({
        selectedModuleId: null,
      });
      this.props.onSelectModule(null);
    }
  };

  handleDragStart = (moduleId, e) => {
    // 기존에 클릭을 통해 선택한 모듈이 있고, 그것과 다른 모듈을 드래그하려 할 때
    // 드래그하려는 모듈을 selectedModule로 설정한다.
    var group = Object.keys(MODULE_LIST)[this.state.selectedGroupId];
    var module = MODULE_LIST[group][moduleId];

    if (this.state.selectedModuleId !== moduleId) {
      this.props.onSelectModule({ group: group, name: module });
      this.setState({
        selectedModuleId: moduleId,
      });
    }

    e.dataTransfer.setData('module', module);
  };

  /**
   * getFunction
   */
  getModuleList = () => {
    // var modules = [];
    if (this.state.selectedGroupId !== null) {
      var group = Object.keys(MODULE_LIST)[this.state.selectedGroupId];
      var modules = MODULE_LIST[group].map((module, i) => {
        return (
          <div
            key={i}
            className={
              this.state.selectedModuleId === i
                ? 'listItem moduleItem selected'
                : 'listItem moduleItem'
            }
            draggable="true"
            onDragStart={e => this.handleDragStart(i, e)}
            onMouseDown={e => this.handleMouseDown(e)}
            onMouseUp={e => this.handleMouseUp('module', i, e)}
            // style={i === this.state.selectedModuleId ? { backgroundColor: '426D92' } : { backgroundColor: 'none' }}
          >
            {module}
          </div>
        );
      });
      return modules;
    }
    return null;
  };

  getGroups = () => {
    var groups = Object.keys(MODULE_LIST).map((group, i) => {
      return (
        <div
          key={i}
          className={
            this.state.selectedGroupId === i
              ? 'listItem groupItem selected'
              : 'listItem groupItem'
          }
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseUp={e => this.handleMouseUp('group', i, e)}
        >
          {group}
        </div>
      );
    });
    return groups;
  };

  render() {
    const groups = this.getGroups();
    const moduleList = this.getModuleList();
    return (
      <Sidebar
        onMouseUp={e => this.handleMouseUp('sidebar', null, e)}
        sidebarWidth={this.state.sidebarWidth}
        groupWidth={this.state.groupWidth}
        groups={groups}
        moduleList={moduleList}
        moduleListWidth={this.state.sidebarWidth - this.state.groupWidth}
      />
    );
  }
}

let mapStateToProps = state => {
  return {
    selectedModule: state.nodesManager.get('selectedModule'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSelectModule: module => dispatch(selectModule(module)),
  };
};

SidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidebarContainer);
export default SidebarContainer;
