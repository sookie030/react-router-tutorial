import React from "react";

// redux modules
import { connect } from "react-redux";
import { selectModule } from "../redux/actions";

// import presentational component
// import Sidebar from '../components/Sidebar';
import ModuleList from "../components/ModuleList";

// import constants
// import MODULE_MANAGER.MODULE_LIST from '../constants/module/ModuleList';
import * as MODULE_MANAGER from "../constants/ModuleInfo";

class ModuleListContainer extends React.Component {
  state = {
    sidebarWidth: 260,
    groupWidth: 100,

    selectedGroupId: null,
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
  handleMouseDown = (e) => {
    e.stopPropagation();
  };

  // handleMouseUp = (type, id, e) => {
  handleMouseUp = (groupID, moduleID, e) => {
    e.stopPropagation();

    // 모듈 선택
    if (groupID !== null && moduleID !== null) {
      this.setState({
        selectedGroupId: groupID,
        selectedModuleId: moduleID,
      });
      let groupName = Object.keys(MODULE_MANAGER.MODULE_LIST)[groupID];
      console.log("groupName", groupName);
      console.log("groupID", groupID);
      this.props.onSelectModule({
        group: groupName,
        name: MODULE_MANAGER.MODULE_LIST[groupName][moduleID],
      });

      // 그 외 사이드바 여백 클릭 시, 모듈 선택 초기화
    } else {
      this.setState({
        selectedGroupId: null,
        selectedModuleId: null,
      });
      this.props.onSelectModule(null);
    }
  };

  handleDragStart = (groupID, moduleID, e) => {
    // 기존에 클릭을 통해 선택한 모듈이 있고, 그것과 다른 모듈을 드래그하려 할 때
    // 드래그하려는 모듈을 selectedModule로 설정한다.
    var groupName = Object.keys(MODULE_MANAGER.MODULE_LIST)[groupID];

    console.log("moduleID", moduleID);
    console.log("groupName", groupName);
    var moduleName = MODULE_MANAGER.MODULE_LIST[groupName][moduleID];

    if (this.state.selectedModuleId !== moduleID) {
      this.props.onSelectModule({ group: groupName, name: moduleName });
      this.setState({
        selectedModuleId: moduleID,
      });
    }

    e.dataTransfer.setData("module", moduleName);
  };

  /**
   * getFunction
   */
  // getModuleList = () => {

  //   if (this.state.selectedGroupId !== null) {
  //     var group = Object.keys(MODULE_MANAGER.MODULE_LIST)[this.state.selectedGroupId];
  //     var modules = MODULE_MANAGER.MODULE_LIST[groupName].map((module, i) => {
  //       return (
  //         <div
  //           key={i}
  //           className={
  //             this.state.selectedModuleId === i
  //               ? 'list-item module-item selected'
  //               : 'list-item module-item'
  //           }
  //           draggable="true"
  //           onDragStart={e => this.handleDragStart(i, e)}
  //           onMouseDown={e => this.handleMouseDown(e)}
  //           onMouseUp={e => this.handleMouseUp('module', i, e)}
  //           // style={i === this.state.selectedModuleId ? { backgroundColor: '426D92' } : { backgroundColor: 'none' }}
  //         >
  //           {module}
  //         </div>
  //       );
  //     });
  //     return modules;
  //   }
  //   return null;
  // };

  // getGroups = () => {
  //   var groups = Object.keys(MODULE_MANAGER.MODULE_LIST).map((group, i) => {
  //     return (
  //       <div
  //         key={i}
  //         className={
  //           this.state.selectedGroupId === i
  //             ? 'list-item group-item selected'
  //             : 'list-item group-item'
  //         }
  //         onMouseDown={e => this.handleMouseDown(e)}
  //         onMouseUp={e => this.handleMouseUp('group', i, e)}
  //       >
  //         {group}
  //       </div>
  //     );
  //   });
  //   return groups;
  // };

  getModuleList = () => {
    let groups = Object.keys(MODULE_MANAGER.MODULE_LIST).map(
      (groupName, groupID) => {
        return (
          <li
            key={groupID}
            onMouseDown={(e) => this.handleMouseDown(e)}
            onMouseUp={(e) => this.handleMouseUp(groupID, null, e)}
          >
            <input id={"group-" + groupID} type="checkbox" hidden />
            <label htmlFor={"group-" + groupID}>
              <span className="tri"></span>
              {groupName}
            </label>
            <ul className="group-list">
              {MODULE_MANAGER.MODULE_LIST[groupName].map(
                (moduleName, moduleID) => {
                  return (
                    <li
                      key={moduleID}
                      draggable="true"
                      onDragStart={(e) =>
                        this.handleDragStart(groupID, moduleID, e)
                      }
                      onMouseDown={(e) => this.handleMouseDown(e)}
                      onMouseUp={(e) =>
                        this.handleMouseUp(groupID, moduleID, e)
                      }
                    >
                      <a href="#">
                        {moduleName}
                        <span>{MODULE_MANAGER.DESC[moduleName]}</span>
                      </a>
                    </li>
                    // <div
                    //   key={i}
                    //   className={
                    //     this.state.selectedModuleId === i
                    //       ? 'list-item module-item selected'
                    //       : 'list-item module-item'
                    //   }
                    //   draggable="true"
                    //   onDragStart={e => this.handleDragStart(i, e)}
                    //   onMouseDown={e => this.handleMouseDown(e)}
                    //   onMouseUp={e => this.handleMouseUp('module', i, e)}
                    //   // style={i === this.state.selectedModuleId ? { backgroundColor: '426D92' } : { backgroundColor: 'none' }}
                    // >
                    //   {module}
                    // </div>
                  );
                }
              )}
            </ul>
          </li>
        );
      }
    );
    return groups;
  };

  render() {
    // const groups = this.getGroups();
    // const moduleList = this.getModuleList();
    const moduleList = this.getModuleList();
    return (
      <ModuleList
        // onMouseUp={e => this.handleMouseUp('sidebar', null, e)}
        // sidebarWidth={this.state.sidebarWidth}
        // groupWidth={this.state.groupWidth}
        // groups={groups}
        moduleList={moduleList}
        // moduleListWidth={this.state.sidebarWidth - this.state.groupWidth}
      />
    );
  }
}

let mapStateToProps = (state) => {
  return {
    selectedModule: state.nodesManager.get("selectedModule"),
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onSelectModule: (module) => dispatch(selectModule(module)),
  };
};

ModuleListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleListContainer);
export default ModuleListContainer;
