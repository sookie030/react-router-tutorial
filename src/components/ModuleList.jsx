import React from "react";

const ModuleList = (props) => (
  <div className="modulelist">
    <div className="title">Data Pipeline</div>
    {/* <ul className="list" style="clear: both;"> */}
    <ul className="list" style={{ clear: "both" }}>
      {props.moduleList}
    </ul>
  </div>
);

export default ModuleList;
