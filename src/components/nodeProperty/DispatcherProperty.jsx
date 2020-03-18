import { MODULES } from '../../constants/ModuleInfo';

var property = {};
property[MODULES.FILE_SAVER] = node => {
  // 20.02.24 test
  let lastDirectory = node.getProperties().getIn(['Directory', 'value']).split('/').pop();
  return ([
    `Directory ${lastDirectory}`
  ])
};
export default property;
