import * as MODULES from '../../constants/module/Modules';

var property = {};
property[MODULES.FILE_SAVER] = node => {
  // 20.02.24 test
  let lastDirectory = node.getProperties().getIn(['Directory', 'value']).split('/').pop();
  console.log(lastDirectory);
  return ([
    `Directory ${lastDirectory}`
  ])
};
export default property;
