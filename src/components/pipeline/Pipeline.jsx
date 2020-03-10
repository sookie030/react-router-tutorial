import React from 'react';

const Pipeline = props => (
  <svg>
    <g
      id="pipeline"
      transform={`matrix(1,0,0,1,${props.translateX},${props.translateY})`}
    >
      <g id="node-layer">{props.nodeList}</g>
      <g id="links-layer">{props.linkList}</g>
    </g>
  </svg>
);

export default Pipeline;
