import { MODULES } from '../../constants/ModuleInfo';

var property = {};

property[MODULES.FACE_DETECTOR] = node => {
  return [`Filter ${node.getProperties().getIn(['Filter', 'value'])}`];
};

export default property;
