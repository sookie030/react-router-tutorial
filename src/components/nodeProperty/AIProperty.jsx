import { MODULES } from '../../constants/ModuleInfo';

var property = {};

property[MODULES.NM500] = node => {
  return [
    `Minif ${node.getProperties().getIn(['Context', 'properties', 'Minif', 'value'])}`,
    `Maxif ${node.getProperties().getIn(['Context', 'properties', 'Maxif', 'value'])}`,
  ];
};

/* Blur Filter는 속성값이 없음 */

property[MODULES.DECISION_MAKER] = node => {
  return [`Category ${node.getProperties().getIn(['Category', 'value'])}`];
};

property[MODULES.SCANNER] = node => {
  return [
    `ROI ${node.getProperties().getIn(['ROI', 'properties', 'Width', 'value'])}x${node.getProperties().getIn(['ROI', 'properties', 'Height', 'value'])}`,
    `Stride ${node.getProperties().getIn(['Stride', 'properties', 'x', 'value'])}, ${node.getProperties().getIn(['Stride', 'properties', 'y', 'value'])}`,
  ];
};

export default property;
