// import parent
import ModuleBase from './ModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as DATA_TYPE from '../../constants/DataType';
import { MODULES } from '../../constants/ModuleInfo';

// import components
import ModuleDataChunk from './ModuleDataChunk';
import ModuleData from './ModuleData';

var feature = {};

feature[MODULES.SUBSAMPLE] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Grid Count': {
        'type': PROP_TYPE.GROUP,
        'properties': {
          'Horizontal': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 16,
          },
          'Vertical': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 16,
          },
        },
      },
    });
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process(inputs) {
    // 입력받아야되는 input의 개수
    var mustInputSize = this.getParentIds().length;

    console.log(
      `[PL Process] ${this.getName()} (input: ${
        inputs.length
      }/${mustInputSize})`,
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`,
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`,
      );

      // 부모 id 초기화. parentIds는 한 번의 process에만 유효하다.
      // this.setParentIds([]);

      // merge data
      // var mergeInputData = this.mergeInputData(inputs);

      // properties 확인
      // console.log(`${this.getName()} 의 속성값을 확인합니다.`);
      // this.printProperty(this.getProperties());

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, [
        this.getID(),
        this.getID(),
        this.getID(),
        this.getID(),
      ]);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      return output;
    }
  }
};

feature[MODULES.HOG] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Edge Type': {
        'type': PROP_TYPE.DROPDOWN,
        'options': [
          { key: 0, text: 'Sobel', value: 'Sobel' },
          { key: 1, text: 'Prewitt', value: 'Prewitt' },
          { key: 2, text: 'Roberts', value: 'Roberts' },
        ],
        'value': 'Sobel',
      },
      'Use Math Function': {
        'type': PROP_TYPE.DROPDOWN,
        'options': [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        'value': 'TRUE',
      },
      'Histogram Binning Count': {
        'type': PROP_TYPE.NUMBER_EDIT,
        'value': 16,
      },
      'Pixel Count Per Cell': {
        'type': PROP_TYPE.GROUP,
        'properties': {
          'Horizontal': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 10,
          },
          'Vertical': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 10,
          },
        },
      },
      'Cell Count Per Block': {
        'type': PROP_TYPE.GROUP,
        'properties': {
          'Horizontal': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 2,
          },
          'Vertical': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 2,
          },
        },
      },
      'Stride Distance': {
        'type': PROP_TYPE.GROUP,
        'properties': {
          'Horizontal': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 12,
          },
          'Vertical': {
            'type': PROP_TYPE.NUMBER_EDIT,
            'value': 12,
          },
        },
      },
      'Use Magnitude Value': {
        'type': PROP_TYPE.DROPDOWN,
        'options': [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        'value': 'TRUE',
      },
    });
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process(inputs) {
    // 입력받아야되는 input의 개수
    var mustInputSize = this.getParentIds().length;

    console.log(
      `[PL Process] ${this.getName()} (input: ${
        inputs.length
      }/${mustInputSize})`,
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`,
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`,
      );

      // 부모 id 초기화. parentIds는 한 번의 process에만 유효하다.
      // this.setParentIds([]);

      // merge data
      // var mergeInputData = this.mergeInputData(inputs);

      // properties 확인
      // console.log(`${this.getName()} 의 속성값을 확인합니다.`);
      // this.printProperty(this.getProperties());

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, [
        this.getID(),
        this.getID(),
        this.getID(),
        this.getID(),
      ]);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      return output;
    }
  }
};

export default feature;
