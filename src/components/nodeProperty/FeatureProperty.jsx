import * as MODULES from '../../constants/module/Modules';

var property = {};

property[MODULES.SUBSAMPLE] = node => {
  return [
    `Grid ${
      node.getProperties().getIn(['Grid Count', 'properties', 'Horizontal', 'value'])
    }x${node.getProperties().getIn(['Grid Count', 'properties', 'Vertical', 'value'])}`,
  ];
};

/* Blur Filter는 속성값이 없음 */

property[MODULES.HOG] = node => {
  return [
    `Edge ${node.getProperties().getIn(['Edge Type', 'value'])}`,
    `Binning ${node.getProperties().getIn(['Histogram Binning Count', 'value'])}`,
  ];
};

export default property;
