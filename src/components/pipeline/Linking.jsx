import React from 'react';

const Linking = props => (
  <g className="link">
    <path
      className="link-path-outline"
      d={
        'M' +
        props.linkStart.x +
        ' ' +
        props.linkStart.y +
        ' C ' +
        (props.linkingPosition.get('x') + props.linkingPosition.get('x')) / 2 +
        ' ' +
        props.linkStart.y +
        ' ' +
        (props.linkStart.x + props.linkingPosition.get('x')) / 2 +
        ' ' +
        props.linkingPosition.get('y') +
        ' ' +
        props.linkingPosition.get('x') +
        ' ' +
        props.linkingPosition.get('y')
      }
    />
    <path
      className="link-path"
      d={
        'M' +
        props.linkStart.x +
        ' ' +
        props.linkStart.y +
        ' C ' +
        (props.linkingPosition.get('x') + props.linkingPosition.get('x')) / 2 +
        ' ' +
        props.linkStart.y +
        ' ' +
        (props.linkStart.x + props.linkingPosition.get('x')) / 2 +
        ' ' +
        props.linkingPosition.get('y') +
        ' ' +
        props.linkingPosition.get('x') +
        ' ' +
        props.linkingPosition.get('y')
      }
    />
    />
    <circle
      className={'link-handle ' + props.linkStart.io + '-handle'}
      cx="0"
      cy="0"
      r="4"
      transform={
        'matrix(1,0,0,1,' + props.linkStart.x + ',' + props.linkStart.y + ')'
      }
    ></circle>
  </g>
);

export default Linking;
