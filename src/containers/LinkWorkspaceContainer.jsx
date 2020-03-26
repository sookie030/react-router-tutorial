import React from "react";

// import container
import Tab from './TabContainer';
import Linkboard from "./LinkboardContainer";
import Sidebar from "./SidebarContainer";
import Toast from "./ToastContainer";
import PropertyNavigator from "./PropertyNavigatorContainer";

const LinkWorkspaceContainer = props => (
  <div className="content-area">

    <Linkboard />
    <Sidebar />
    <Tab />
    <PropertyNavigator />
    <Toast />
  </div>
);

export default LinkWorkspaceContainer;
