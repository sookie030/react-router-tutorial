// import parent
import ModuleBase from './ModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as MODULES from '../../constants/module/Modules';

// import components
import ModuleDataChunk from './ModuleDataChunk';

var dispatcher = {};

dispatcher[MODULES.FILE_SAVER] = class extends ModuleBase {
  constructor() {
    super();

    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      'Directory': {
        'type': PROP_TYPE.SELECT_DIRECTORY,
        'value': '-',
        'list': [],
      },
    });

    // file list 설정
    // this.setList();
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  // setList = () => {
  //   let newProperties = null;
  //   let path = this.getProperties().getIn(['Directory', 'value']);

  //   fs.exists(path, isExist => {
  //     if (isExist) {
  //       fs.readdir(path, (err, files) => {
  //         if (err) {
  //           newProperties = this.getProperties().setIn(
  //             ['Directory', 'list'],
  //             ['Cannot load files.'],
  //           );
  //         } else {
  //           newProperties = this.getProperties().setIn(
  //             ['Directory', 'list'],
  //             files,
  //           );
  //         }

  //         this.setProperties(newProperties);
  //       });
  //     } else {
  //       newProperties = this.getProperties().setIn(
  //         ['Directory', 'list'],
  //         ['Invalid Directory.'],
  //       );
  //       this.setProperties(newProperties);
  //     }
  //   });
  // };

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async inputs => {
    let output = new ModuleDataChunk();
    this.setOutput(output);
    return output;
  };
};


export default dispatcher;
