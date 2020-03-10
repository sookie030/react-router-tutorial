import React from 'react';
import '../assets/styles/contextmenu.css';

const ContextMenu = props => (
  <svg
    transform={
      props.position !== null
        ? 'matrix(1,0,0,1,' +
          props.position.get('x') +
          ',' +
          props.position.get('y') +
          ')'
        : 'matrix(1,0,0,1,0,0)'
    }
    style={{
      display: props.isShowing ? 'block' : 'none',
      width: '200',
      height: 10 + 30 * props.getMenuItems.length,
    }}
  >
    <g>
      <rect
        className="contextmenu"
        x="0"
        y="0"
        rx="3"
        ry="3"
        height={10 + 30 * props.getMenuItems.length}
      />
      {props.getMenuItems}
    </g>
  </svg>
);

export default ContextMenu;
