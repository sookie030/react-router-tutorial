import React from 'react';

// import container
import Linkboard from '../../container/LinkboardContainer';
import Sidebar from '../../container/SidebarContainer';
import Toast from '../../container/ToastContainer';
import PropertyNavigator from '../../container/PropertyNavigatorContainer';

const DefaultTabPane = props => (
  <div
    className={`tabcontent${
      props.selectedIndex === props.tabIndex ? ' selected' : ''
    }`}
  >
    <React.Fragment>
      <Linkboard />
      <Sidebar />

      {/** Test for File Loader/Saver */}
      <PropertyNavigator />
      <Toast />
    </React.Fragment>
  </div>
);

export default DefaultTabPane;
