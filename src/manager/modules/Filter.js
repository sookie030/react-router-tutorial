// import parent
import ModuleBase from './ModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as DATA_TYPE from '../../constants/DataType';
import * as MODULES from '../../constants/module/Modules';

// import components
import ModuleDataChunk from './ModuleDataChunk';
import ModuleData from './ModuleData';

var filter = {};

filter[MODULES.ROI] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Area: {
        type: PROP_TYPE.GROUP,
        properties: {
          x: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 140,
          },
          y: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 125,
          },
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 220,
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 220,
          },
        },
      },
      Color: {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'White', value: 'White' },
          { key: 1, text: 'Red', value: 'Red' },
          { key: 2, text: 'Green', value: 'Green' },
          { key: 3, text: 'Blue', value: 'Blue' },
        ],
        value: 'White',
      },
    });
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  async process(inputs) {
    // 입력받아야되는 input의 개수
    let mustInputSize = this.getParentIds().length;

    // console.log(`[PL Process] ${this.getName()} (input: ${inputs.length}/${mustInputSize})`);

    // input data 찍어보기
    // console.log(inputs);

    let output;
    if (mustInputSize !== inputs.length) {
      console.log(`${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`);
      return null;
    } else {
      // process 시작

      // input 출력해보기
      //   if (inputs.length > 0) {
      //     console.log(inputs);
      //     console.log(inputs[0]);
      //   }

      // merge data
      // var mergeInputData = this.mergeInputData(inputs);

      const props = this.getProperties();
      const x = Number(props.getIn(['Area', 'properties', 'x', 'value']));
      const y = Number(props.getIn(['Area', 'properties', 'y', 'value']));
      const width = Number(
        props.getIn(['Area', 'properties', 'Width', 'value']),
      );
      const height = Number(
        props.getIn(['Area', 'properties', 'Height', 'value']),
      );

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getRawData();

      // ROI 적용
      let croppedImageBitmap = await createImageBitmap (mergeInputData, x, y, width, height);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, croppedImageBitmap);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return output;
    }
  }
};

filter[MODULES.BLUR_AVERAGE] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    this.initialize({});
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

filter[MODULES.BLUR_MEDIAN] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);
    this.initialize({});
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

filter[MODULES.BLUR_BIATERAL] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);
    this.initialize({});
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

filter[MODULES.EDGE_SOBEL] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      'Use Math Function': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        value: 'FALSE',
      },
      'Threshold Ratio': {
        type: PROP_TYPE.NUMBER_EDIT,
        value: 80,
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

filter[MODULES.EDGE_PREWITT] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      'Use Math Function': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        value: 'FALSE',
      },
      'Threshold Ratio': {
        type: PROP_TYPE.NUMBER_EDIT,
        value: 80,
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

filter[MODULES.EDGE_ROBERTS] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      'Use Math Function': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        value: 'FALSE',
      },
      'Threshold Ratio': {
        type: PROP_TYPE.NUMBER_EDIT,
        value: 80,
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

filter[MODULES.EDGE_CANNY] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      'Edge Type': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'Sobel', value: 'Sobel' },
          { key: 1, text: 'Prewitt', value: 'Prewitt' },
          { key: 2, text: 'Roberts', value: 'Roberts' },
        ],
        value: 'Sobel',
      },
      'Use Math Function': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        value: 'FALSE',
      },
      'Threshold Ratio': {
        type: PROP_TYPE.GROUP,
        properties: {
          High: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 50,
          },
          Low: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 80,
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

filter[MODULES.EDGE_HOUGH] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      'Search Target': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'Line', value: 'Line' },
          { key: 1, text: 'Circle', value: 'Circle' },
        ],
        value: 'Line',
      },
      'Edge Type': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'Sobel', value: 'Sobel' },
          { key: 1, text: 'Prewitt', value: 'Prewitt' },
          { key: 2, text: 'Roberts', value: 'Roberts' },
        ],
        value: 'Sobel',
      },
      'Use Math Function': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'TRUE', value: 'TRUE' },
          { key: 1, text: 'FALSE', value: 'FALSE' },
        ],
        value: 'FALSE',
      },
      'Threshold Ratio': {
        type: PROP_TYPE.GROUP,
        properties: {
          High: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 50,
          },
          Low: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 80,
          },
        },
      },
      'Threshold Count': {
        type: PROP_TYPE.NUMBER_EDIT,
        value: 300,
      },
      Radius: {
        type: PROP_TYPE.GROUP,
        properties: {
          Min: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
          },
          Max: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 200,
          },
          Step: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 2,
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

filter[MODULES.GRAYSCALE] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Area: {
        type: PROP_TYPE.GROUP,
        properties: {
          x: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          y: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
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

filter[MODULES.RESIZE] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Size: {
        type: PROP_TYPE.GROUP,
        properties: {
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 32,
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 32,
          },
        },
      },
      'Resize Type': {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'Average', value: 'Average' },
          { key: 1, text: 'Hop', value: 'Hop' },
        ],
        value: 'Average',
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

filter[MODULES.CROP] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Size: {
        type: PROP_TYPE.GROUP,
        properties: {
          x: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          y: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 0,
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

export default filter;
