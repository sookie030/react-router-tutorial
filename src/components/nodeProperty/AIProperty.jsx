import * as MODULES from '../../constants/module/Modules';

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

export default property;
