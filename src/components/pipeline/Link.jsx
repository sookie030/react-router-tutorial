import React from 'react';

const Link = props => (
  <svg>
    {/* link 에 화살표 추가 */}
    <defs>
      <marker id="Triangle" orient="auto" refX="1" refY="1">
        <path d="M 0 0 L 2 1 L 0 2 z" fill="rgb(119, 158, 168)" />
      </marker>
    </defs>
    <g
      className="link"
      onMouseDown={props.handleMouseDown}
      markerEnd="url(#Triangle)"
    >
      <path
        className="link-path-outline"
        style={
          props.link.get('id') === props.selectedlinkID
            ? { stroke: 'rgb(206, 255, 29)' }
            : { stroke: 'none' }
        }
        d={
          'M' +
          props.link.getIn(['from', 'x']) +
          ' ' +
          props.link.getIn(['from', 'y']) +
          // + ' C ' + (props.link.getIn(['from', 'x']) + props.link.getIn(['to', 'x'])) / 2
          // + ' ' + props.link.getIn(['from', 'y'])
          // + ' ' + (props.link.getIn(['from', 'x']) + props.link.getIn(['to', 'x'])) / 2
          // + ' ' + props.link.getIn(['to', 'y'])

          ' ' +
          props.link.getIn(['to', 'x']) +
          ' ' +
          props.link.getIn(['to', 'y'])
        }
      />

      <path
        className="link-path"
        onMouseOver={props.handleLinkMouseOver}
        onMouseLeave={props.handleLinkMouseLeave}
        d={
          'M' +
          props.link.getIn(['from', 'x']) +
          ' ' +
          props.link.getIn(['from', 'y']) +
          // + ' C ' + (props.link.getIn(['from', 'x']) + props.link.getIn(['to', 'x'])) / 2
          // + ' ' + props.link.getIn(['from', 'y'])
          // + ' ' + (props.link.getIn(['from', 'x']) + props.link.getIn(['to', 'x'])) / 2
          // + ' ' + props.link.getIn(['to', 'y'])

          ' ' +
          props.link.getIn(['to', 'x']) +
          ' ' +
          props.link.getIn(['to', 'y'])
        }
      />

      <circle
        className={
          'link-handle ' + props.link.getIn(['from', 'io']) + '-handle'
        }
        cx="0"
        cy="0"
        r="4"
        transform={
          'matrix(1,0,0,1,' +
          props.link.getIn(['from', 'x']) +
          ', ' +
          props.link.getIn(['from', 'y']) +
          ')'
        }
        style={
          props.link.get('id') === props.selectedlinkID
            ? { stroke: 'rgb(206, 255, 29)' }
            : { stroke: 'none' }
        }
        onMouseDown={props.handleLinkMouseDown}
      />
    </g>
  </svg>
);

export default Link;
