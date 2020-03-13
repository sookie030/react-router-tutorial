// import parent
import ModuleBase from './ModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as DATA_TYPE from '../../constants/DataType';

// import components
import ModuleDataChunk from './ModuleDataChunk';
import ModuleData from './ModuleData';
import * as MODULES from '../../constants/module/Modules';

var notifier = {};

notifier[MODULES.SOUND] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Alarm': {
        'type': PROP_TYPE.DROPDOWN,
        'options': [
          { key: 0, text: 'Basic0', value: 'Basic0' },
          { key: 1, text: 'Basic1', value: 'Basic1' },
          { key: 2, text: 'Basic2', value: 'Basic2' },
          { key: 3, text: 'Basic3', value: 'Basic3' },
        ],
        'value': 'Basic0',
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

notifier[MODULES.VIBRATION] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Vibration length': {
        'type': PROP_TYPE.NUMBER_EDIT,
        'value': 1000,
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

notifier[MODULES.DISPLAY] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Display time': {
        'type': PROP_TYPE.NUMBER_EDIT,
        'value': 1000,
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

notifier[MODULES.GRID_MAKER] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      'Threshold': {
        'type': PROP_TYPE.NUMBER_EDIT,
        'value': 1,
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

export default notifier;
