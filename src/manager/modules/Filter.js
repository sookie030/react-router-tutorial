// import parent
import ModuleBase from "./ModuleBase";
import * as PROP_TYPE from "../../constants/PropertyType";

// import constants
import * as DATA_TYPE from "../../constants/DataType";
import { MODULES } from "../../constants/ModuleInfo";

// import components
import ModuleDataChunk from "./ModuleDataChunk";
import ModuleData from "./ModuleData";

const vision = require("../../lib/vision/corewrap");
const constants = require("../../lib/vision/constants");
const datatypes = require("../../lib/vision/datatypes");

// import module from preload
const fs = window.fs;
const ref = window.ref;
const ArrayType = window.ArrayType;

// define array type
// let uint8Array = ArrayType("uint8");

var filter = {};

// 19년도 언젠가.. 완료
filter[MODULES.ROI] = class extends ModuleBase {
  constructor() {
    super();

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
          { key: 0, text: "White", value: "White" },
          { key: 1, text: "Red", value: "Red" },
          { key: 2, text: "Green", value: "Green" },
          { key: 3, text: "Blue", value: "Blue" },
        ],
        value: "White",
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
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작

      // input 출력해보기
      if (inputs.length > 0) {
        console.log(inputs);
        console.log(inputs[0]);
      }

      // merge data
      // var mergeInputData = this.mergeInputData(inputs);

      const props = this.getProperties();
      const x = Number(props.getIn(["Area", "properties", "x", "value"]));
      const y = Number(props.getIn(["Area", "properties", "y", "value"]));
      const width = Number(
        props.getIn(["Area", "properties", "Width", "value"])
      );
      const height = Number(
        props.getIn(["Area", "properties", "Height", "value"])
      );

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // ROI 적용
      let croppedImageBitmap = await createImageBitmap(
        mergeInputData,
        x,
        y,
        width,
        height
      );

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
  constructor() {
    super();

    this.initialize({});
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process(inputs) {
    // 입력받아야되는 input의 개수
    var mustInputSize = this.getParentIds().length;

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
      );

      // 20.04.08 test
      let inputData = inputs[0].getModuleDataList()[0].getData().data;
      let rgb888Data = inputData.filter((elem, index) => {
        if ((index + 1) % 4 !== 0) {
          return elem;
        }
      });

      // rgb888Data = new Uint8Array(rgb888Data);

      // // to use vision lib
      // let sizeInfo = new datatypes.SizeInfo();
      // sizeInfo.width = inputData.width;
      // sizeInfo.height = inputData.height;

      // let bytesPerPixel = vision.getBytesPerPixel(
      //   constants.COLOR_FORMAT.COLOR_RGB_888
      // );

      // let imageInfoStr = new datatypes.ImageInfo();
      // imageInfoStr.data = Buffer.from(rgb888Data);
      // imageInfoStr.size = sizeInfo;
      // imageInfoStr.color = constants.COLOR_FORMAT.COLOR_RGB_888;
      // imageInfoStr.bytes_per_pixel = bytesPerPixel;
      // imageInfoStr.coordinate = constants.COORDINATE_TYPE.COORDINATE_LEFT_TOP;

      // console.log(imageInfoStr.data);

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
  constructor() {
    super();
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
    this.initialize({
      "Use Math Function": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "FALSE",
      },
      "Threshold Ratio": {
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
    this.initialize({
      "Use Math Function": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "FALSE",
      },
      "Threshold Ratio": {
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
    this.initialize({
      "Use Math Function": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "FALSE",
      },
      "Threshold Ratio": {
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
    this.initialize({
      "Edge Type": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "Sobel", value: "Sobel" },
          { key: 1, text: "Prewitt", value: "Prewitt" },
          { key: 2, text: "Roberts", value: "Roberts" },
        ],
        value: "Sobel",
      },
      "Use Math Function": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "FALSE",
      },
      "Threshold Ratio": {
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
    this.initialize({
      "Search Target": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "Line", value: "Line" },
          { key: 1, text: "Circle", value: "Circle" },
        ],
        value: "Line",
      },
      "Edge Type": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "Sobel", value: "Sobel" },
          { key: 1, text: "Prewitt", value: "Prewitt" },
          { key: 2, text: "Roberts", value: "Roberts" },
        ],
        value: "Sobel",
      },
      "Use Math Function": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "FALSE",
      },
      "Threshold Ratio": {
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
      "Threshold Count": {
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
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
  constructor() {
    super();

    // default properties
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
      }/${mustInputSize})`
    );

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();
      let inputType = inputs[0].getModuleDataList()[0].getType();

      // RGBA -> RGB (Alpha 제외)
      // map 말고 forEach 사용한 이유: element === 0 이면 return 0이 되어 데이터가 유실됨
      let noAlpha = [];
      mergeInputData.data.forEach((elem, index) => {
        if ((index + 1) % 4 > 0) {
          noAlpha.push(elem);
        }
      });
      noAlpha = Uint8Array.from(noAlpha);

      // Create ImageInfo Struct
      let data = Buffer.from(Uint8Array.from(noAlpha));
      let size = new datatypes.SizeInfo({
        width: mergeInputData.width,
        height: mergeInputData.height,
      });

      let imageInfoStr = new datatypes.ImageInfo({
        color: constants.COLOR_FORMAT.COLOR_RGB_888,
        bytes_per_pixel: 3,
        coordinate: constants.COORDINATE_TYPE.COORDINATE_LEFT_TOP,
        data: data,
        size: size,
      });

      // Create pointer
      let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

      // Create grayscale buffer
      let tmpSize =
        imageInfoStr.size.width *
        imageInfoStr.size.height *
        Uint8Array.BYTES_PER_ELEMENT;

      let tempBufferPtr = Buffer.from(new Uint8Array(tmpSize).buffer);

      // Call function
      vision.getGrayscaleImageRaw(imageInfoPtr, tempBufferPtr);

      // get values from Buffer (result)
      let bytes = tmpSize * Uint8Array.BYTES_PER_ELEMENT;
      // let result = new Uint8Array(tempBufferPtr.reinterpret(bytes));
      let result = ref.reinterpret(tempBufferPtr, bytes);

      // Print grayscale image data
      console.log("grayscale tempBufferPtr: ", result);

      // Create RGBA
      const arr = new Uint8ClampedArray(result.length * 4);
      for (let i = 0; i < result.length; i++) {
        // RGB에는 같은 값 (Grayscale)
        arr[i * 4 + 0] = result[i];
        arr[i * 4 + 1] = result[i];
        arr[i * 4 + 2] = result[i];

        // Alpha는 항상 255
        arr[i * 4 + 3] = 255;
      }

      // Create new ImageData
      let newImageData = new ImageData(arr, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);
      console.log(newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return output;
    }
  }
};

// 20.03.17 완료 (Average/Hop 옵션 무시)
filter[MODULES.RESIZE] = class extends ModuleBase {
  constructor() {
    super();

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
      "Resize Type": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "Average", value: "Average" },
          { key: 1, text: "Hop", value: "Hop" },
        ],
        value: "Average",
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

    let output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작

      const props = this.getProperties();
      const width = Number(
        props.getIn(["Size", "properties", "Width", "value"])
      );
      const height = Number(
        props.getIn(["Size", "properties", "Height", "value"])
      );

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // Resize 적용
      let resizedImageBitmap = await createImageBitmap(mergeInputData, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: "high",
      });

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, resizedImageBitmap);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return output;
    }
  }
};

// 20.03.17 완료
filter[MODULES.CROP] = class extends ModuleBase {
  constructor() {
    super();

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
  async process(inputs) {
    // 입력받아야되는 input의 개수
    let mustInputSize = this.getParentIds().length;

    // console.log(`[PL Process] ${this.getName()} (input: ${inputs.length}/${mustInputSize})`);

    // input data 찍어보기
    // console.log(inputs);

    let output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
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
      const x = Number(props.getIn(["Size", "properties", "x", "value"]));
      const y = Number(props.getIn(["Size", "properties", "y", "value"]));
      const width = Number(
        props.getIn(["Size", "properties", "Width", "value"])
      );
      const height = Number(
        props.getIn(["Size", "properties", "Height", "value"])
      );

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // ROI 적용
      let croppedImageBitmap = await createImageBitmap(
        mergeInputData,
        x,
        y,
        width,
        height
      );

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, croppedImageBitmap);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return output;
    }
  }
};

filter[MODULES.GRID] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      Size: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Size Width": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 10,
          },
          "Size Height": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 10,
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
      }/${mustInputSize})`
    );

    // input data 찍어보기
    // console.log(inputs);

    var output;
    if (mustInputSize !== inputs.length) {
      console.log(
        `${this.getName()} input이 모두 들어오지 않아 실행하지 않습니다.`
      );
      return null;
    } else {
      // process 시작
      console.log(
        `[PL Process] ${this.getName()} input이 모두 들어와 실행합니다.`
      );

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
