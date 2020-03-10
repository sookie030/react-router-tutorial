import React from "react";

// import container
import Linkboard from "./LinkboardContainer";
import Sidebar from "./SidebarContainer";
import Toast from "./ToastContainer";
import PropertyNavigator from "./PropertyNavigatorContainer";

const LinkWorkspaceContainer = props => (
  <div>
    <Linkboard />
    <Sidebar />
    <PropertyNavigator />
    {/* <Toast /> */}
  </div>
);

export default LinkWorkspaceContainer;
