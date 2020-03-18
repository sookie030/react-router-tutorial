import { MODULES } from '../../constants/ModuleInfo';

var property = {};
property[MODULES.CAMERA] = node => {
  return ([
    `Camera ${node.getProperties().getIn(['Camera', 'value'])}`,
    `Size ${node.getProperties().getIn(['Preview Size', 'value'])}`,
  ])
};

property[MODULES.FACE_CAMERA] = node => {
  return ([
    `Camera ${node.getProperties().getIn(['Camera', 'value'])}`,
    `Size ${node.getProperties().getIn(['Preview Size', 'value'])}`,
  ])
};

property[MODULES.FILE_LOADER] = node => {
  // 20.02.24 test
  let lastDirectory = node.getProperties().getIn(['Directory', 'value']).split('/').pop();
  return ([
    `Directory ${lastDirectory}`
  ])
};

export default property;
