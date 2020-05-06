import React from 'react';

// redux modules
import { connect } from 'react-redux';
import { selectModule } from '../redux/actions';

// import presentational component
import Sidebar from '../components/Sidebar';

// import constants
// import MODULE_MANAGER.MODULE_LIST from '../constants/module/ModuleList';
import * as MODULE_MANAGER from '../constants/ModuleInfo';

class SidebarContainer extends React.Component {

  render() {
    return (
      <Sidebar />
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
