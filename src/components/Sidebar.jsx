import React from 'react';
import '../assets/styles/sidebar.css';

const Sidebar = props => (
  <React.Fragment>
    <div
      id="sidebar"
      style={{ width: props.sidebarWidth }}
      onMouseUp={props.onMouseUp}
    >
      <div id="groups" style={{ width: props.groupWidth }}>
        {props.groups}
      </div>
      <div id="moduleList" style={{ width: props.moduleListWidth }}>
        {props.moduleList}
      </div>
    </div>
  </React.Fragment>
);

export default Sidebar;
