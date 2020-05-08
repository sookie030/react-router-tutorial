// import parent
import ModuleBase from "./ModuleBase";
import * as PROP_TYPE from "../../constants/PropertyType";

// import constants
import * as DATA_TYPE from "../../constants/DataType";
import * as RESULT_CODE from "../../constants/ResultCode";
import { MODULES } from "../../constants/ModuleInfo";

// import components
import ModuleDataChunk from "./ModuleDataChunk";
import ModuleData from "./ModuleData";

// import utils
import * as ImageFormatConverter from "../../utils/ImageFormatConverter";

// const vision = require("../../lib/vision/corewrap");
// const constants = require("../../lib/vision/constants");
// const datatypes = require("../../lib/vision/datatypes");
import vision from "../../lib/vision/corewrap";
import constants from "../../lib/vision/constants";
import datatypes from "../../lib/vision/datatypes";

// import module from preload
const ref = window.ref;

let filter = {};

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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // Get properties
      const props = this.getProperties();
      const x = Number(props.getIn(["Area", "properties", "x", "value"]));
      const y = Number(props.getIn(["Area", "properties", "y", "value"]));
      const width = Number(
        props.getIn(["Area", "properties", "Width", "value"])
      );
      const height = Number(
        props.getIn(["Area", "properties", "Height", "value"])
      );

      // ROI 적용
      let image = await createImageBitmap(mergeInputData, x, y, width, height);

      let canvas = new OffscreenCanvas(image.width, image.height);
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      let myData = context.getImageData(0, 0, image.width, image.height);
      console.log(myData);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, myData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.20 완료
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    }

    // process 시작

    // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
    let mergeInputData = inputs[0].getModuleDataList()[0].getData();

    // RGBA -> RGB (Alpha 제외)
    let noAlpha = Uint8Array.from(
      ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
    );

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

    // Create temp buffer
    let tempSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      imageInfoStr.bytes_per_pixel *
      Uint8Array.BYTES_PER_ELEMENT;

    let tempBufferPtr = Buffer.from(new Uint8Array(tempSize).buffer);

    // Create result buffer
    let resultSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;

    let resultBufferPtr = Buffer.from(new Uint8Array(resultSize).buffer);

    // Call function
    vision.getAverageBlurGray(imageInfoPtr, tempBufferPtr, resultBufferPtr);

    // get values from Buffer (result)
    let result = ref.reinterpret(resultBufferPtr, resultSize);

    let blur = ImageFormatConverter.convertGray1toGray4(result);

    // Create new ImageData
    let newImageData = new ImageData(
      Uint8ClampedArray.from(blur),
      mergeInputData.width
    );

    // output 저장공간
    var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);
    
    output = new ModuleDataChunk();
    output.addModuleData(output1);

    // Output으로 저장
    this.setOutput(output);

    return RESULT_CODE.SUCCESS;
  }
};

// 20.04.20 완료
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

    var output;
    if (mustInputSize !== inputs.length) {
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    }

    // process 시작

    // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
    let mergeInputData = inputs[0].getModuleDataList()[0].getData();

    // RGBA -> RGB (Alpha 제외)
    let noAlpha = Uint8Array.from(
      ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
    );

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

    // Create temp buffer
    let tempSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      imageInfoStr.bytes_per_pixel *
      Uint8Array.BYTES_PER_ELEMENT;

    let tempBufferPtr = Buffer.from(new Uint8Array(tempSize).buffer);

    // Create result buffer
    let resultSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;

    let resultBufferPtr = Buffer.from(new Uint8Array(resultSize).buffer);

    // Call function
    vision.getMedianBlurGray(imageInfoPtr, tempBufferPtr, resultBufferPtr);

    // get values from Buffer (result)
    let result = ref.reinterpret(resultBufferPtr, resultSize);

    let blur = ImageFormatConverter.convertGray1toGray4(result);

    // Create new ImageData
    let newImageData = new ImageData(
      Uint8ClampedArray.from(blur),
      mergeInputData.width
    );

    // output 저장공간
    var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

    output = new ModuleDataChunk();
    output.addModuleData(output1);

    // Output으로 저장
    this.setOutput(output);

    return RESULT_CODE.SUCCESS;
  }
};

// 20.04.20 완료
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

    var output;
    if (mustInputSize !== inputs.length) {
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    }

    // process 시작

    // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
    let mergeInputData = inputs[0].getModuleDataList()[0].getData();

    // RGBA -> RGB (Alpha 제외)
    let noAlpha = Uint8Array.from(
      ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
    );

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

    // Create temp buffer
    let tempSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      imageInfoStr.bytes_per_pixel *
      Uint8Array.BYTES_PER_ELEMENT;

    let tempBufferPtr = Buffer.from(new Uint8Array(tempSize).buffer);

    // Create result buffer
    let resultSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;

    let resultBufferPtr = Buffer.from(new Uint8Array(resultSize).buffer);

    // Call function
    vision.getBilateralBlurGray(imageInfoPtr, tempBufferPtr, resultBufferPtr);

    // get values from Buffer (result)
    let result = ref.reinterpret(resultBufferPtr, resultSize);

    let blur = ImageFormatConverter.convertGray1toGray4(result);

    // Create new ImageData
    let newImageData = new ImageData(
      Uint8ClampedArray.from(blur),
      mergeInputData.width
    );

    // output 저장공간
    var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

    output = new ModuleDataChunk();
    output.addModuleData(output1);

    // Output으로 저장
    this.setOutput(output);

    return RESULT_CODE.SUCCESS;
  }
};

// 20.04.20 완료
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create sobel option
      const props = this.getProperties();
      const useMath = props.getIn(["Use Math Function", "value"]);
      const ThresholdRatio = Number(props.getIn(["Threshold Ratio", "value"]));

      let optionsStr = new datatypes.SobelOptions();
      optionsStr.use_math = useMath;
      optionsStr.threshold_ratio = ThresholdRatio;

      // Call functioon
      let result = vision.edgeSobel(imageInfoStr, optionsStr);

      // Create RGBA (Gray)
      let grayscale = Uint8ClampedArray.from(
        ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      );

      // Create new ImageData
      let newImageData = new ImageData(grayscale, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.20 완료
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create sobel option
      const props = this.getProperties();
      const useMath = props.getIn(["Use Math Function", "value"]);
      const ThresholdRatio = Number(props.getIn(["Threshold Ratio", "value"]));

      let optionsStr = new datatypes.PrewittOptions();
      optionsStr.use_math = useMath;
      optionsStr.threshold_ratio = ThresholdRatio;

      // Call functioon
      let result = vision.edgePrewitt(imageInfoStr, optionsStr);

      // Create RGBA (Gray)
      let grayscale = Uint8ClampedArray.from(
        ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      );

      // Create new ImageData
      let newImageData = new ImageData(grayscale, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.20 완료
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create sobel option
      const props = this.getProperties();
      const useMath = props.getIn(["Use Math Function", "value"]);
      const ThresholdRatio = Number(props.getIn(["Threshold Ratio", "value"]));
console.log(ThresholdRatio)
      let optionsStr = new datatypes.RobertsOptions();
      optionsStr.use_math = useMath;
      optionsStr.threshold_ratio = ThresholdRatio;

      // Call functioon
      let result = vision.edgePrewitt(imageInfoStr, optionsStr);

      // Create RGBA (Gray)
      let grayscale = Uint8ClampedArray.from(
        ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      );

      // Create new ImageData
      let newImageData = new ImageData(grayscale, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.23 완료 
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create sobel option
      const props = this.getProperties();
      const edge =
        props.getIn(["Edge Type", "value"]) === "Sobel"
          ? constants.EDGE_TYPE.EDGE_SOBEL
          : props.getIn(["Edge Type", "value"]) === "Prewitt"
          ? constants.EDGE_TYPE.EDGE_PREWITT
          : props.getIn(["Edge Type", "value"]) === "Roberts"
          ? constants.EDGE_TYPE.EDGE_ROBERTS
          : constants.EDGE_TYPE.EDGE_SOBEL;
      const useMath = props.getIn(["Use Math Function", "value"]);
      const thresholdRatioHigh = Number(props.getIn([
        "Threshold Ratio",
        "High",
        "value",
      ]));
      const thresholdRatioLow = Number(props.getIn([
        "Threshold Ratio",
        "Low",
        "value",
      ]));

      let optionsStr = new datatypes.CannyOptions();
      optionsStr.blur = constants.BLUR_TYPE.BLUR_NONE;
      optionsStr.edge = edge;
      optionsStr.use_math = useMath;
      optionsStr.threshold_high_ratio = thresholdRatioHigh;
      optionsStr.threshold_low_ratio = thresholdRatioLow;

      // Call functioon
      let resultImageStr = vision.edgeCanny(imageInfoStr, optionsStr);
      let resultSize =
        resultImageStr.size.width *
        resultImageStr.size.height *
        Uint8Array.BYTES_PER_ELEMENT;

      // get values from Buffer (result)
      let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
      let result = ref.reinterpret(resultImageStr.data, bytes);

      // Create RGBA (Gray)
      let grayscale = Uint8ClampedArray.from(
        ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      );

      // Create new ImageData
      let newImageData = new ImageData(grayscale, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.20 완료했으나 오류
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create sobel option
      const props = this.getProperties();
      const target = props.getIn(["Search Target", "value"]);
      const edge =
        props.getIn(["Edge Type", "value"]) === "Sobel"
          ? constants.EDGE_TYPE.EDGE_SOBEL
          : props.getIn(["Edge Type", "value"]) === "Prewitt"
          ? constants.EDGE_TYPE.EDGE_PREWITT
          : props.getIn(["Edge Type", "value"]) === "Roberts"
          ? constants.EDGE_TYPE.EDGE_ROBERTS
          : constants.EDGE_TYPE.EDGE_SOBEL;
      const useMath = props.getIn(["Use Math Function", "value"]);
      const thresholdRatioHigh = Number(props.getIn([
        "Threshold Ratio",
        "High",
        "value",
      ]));
      const thresholdRatioLow = Number(props.getIn([
        "Threshold Ratio",
        "Low",
        "value",
      ]));
      const ThresholdCount = Number(props.getIn(["Threshold Ratio", "value"]));
      const radiusMin = Number(props.getIn(["Radius", "Min", "value"]));
      const radiusMax = Number(props.getIn(["Radius", "Max", "value"]));
      const radiusStep = Number(props.getIn(["Radius", "Step", "value"]));

      let optionsStr;
      let result;

      if (target === "Line") {
        optionsStr = new datatypes.edgeHoughLineOptions();
        optionsStr.blur = constants.BLUR_TYPE.BLUR_NONE;
        optionsStr.edge = edge;
        optionsStr.use_math = useMath;
        optionsStr.threshold_high_ratio = thresholdRatioHigh;
        optionsStr.threshold_low_ratio = thresholdRatioLow;
        optionsStr.threshold = ThresholdCount; // 이게 맞는지 모르겠다

        result = vision.edgeHoughLine(imageInfoStr, optionsStr);
      } else if (target === "Circle") {
        optionsStr = new datatypes.edgeHoughCircleOptions();
        optionsStr.blur = constants.BLUR_TYPE.BLUR_NONE;
        optionsStr.edge = edge;
        optionsStr.use_math = useMath;
        optionsStr.threshold_high_ratio = thresholdRatioHigh;
        optionsStr.threshold_low_ratio = thresholdRatioLow;
        optionsStr.threshold = ThresholdCount; // 이게 맞는지 모르겠다
        optionsStr.min_radius = radiusMin;
        optionsStr.max_radius = radiusMax;
        optionsStr.radius_stride = radiusStep;

        result = vision.edgeHoughCircle(imageInfoStr, optionsStr);
      }

      // // Create RGBA (Gray)
      // let grayscale = Uint8ClampedArray.from(
      //   ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      // );

      // // Create new ImageData
      // let newImageData = new ImageData(grayscale, mergeInputData.width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, [0, 0, 0, 0]);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.14 완료 (Vision Library)
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
    let mustInputSize = this.getParentIds().length;
    let output;

    if (mustInputSize !== inputs.length) {
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    }

    // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
    let mergeInputData = inputs[0].getModuleDataList()[0].getData();

    // RGBA -> RGB (Alpha 제외)
    let noAlpha = Uint8Array.from(
      ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
    );

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
    let resultSize =
      imageInfoStr.size.width *
      imageInfoStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;

    let resultBufferPtr = Buffer.from(new Uint8Array(resultSize).buffer);

    // Call function
    vision.getGrayscaleImageRaw(imageInfoPtr, resultBufferPtr);

    // get values from Buffer (result)
    let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
    let result = ref.reinterpret(resultBufferPtr, bytes);

    // Create RGBA (Gray)
    let grayscale = Uint8ClampedArray.from(
      ImageFormatConverter.convertGray1toGray4ClampedArray(result)
    );

    // Create new ImageData
    let newImageData = new ImageData(grayscale, mergeInputData.width);

    // output 저장공간
    var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);
    // console.log(newImageData);

    output = new ModuleDataChunk();
    output.addModuleData(output1);

    // Output으로 저장
    this.setOutput(output);

    return RESULT_CODE.SUCCESS;
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
    } else {
      // process 시작

      const props = this.getProperties();
      const type =
        props.getIn(["Resize Type", "value"]) === "Average"
          ? constants.RESIZE_TYPE.RESIZE_AVERAGE
          : constants.RESIZE_TYPE.RESIZE_HOP;
      const width = Number(
        props.getIn(["Size", "properties", "Width", "value"])
      );
      const height = Number(
        props.getIn(["Size", "properties", "Height", "value"])
      );

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

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

      // Create SizeInfo Struct
      let targetSizeStr = new datatypes.SizeInfo();
      targetSizeStr.width = width;
      targetSizeStr.height = height;

      // Call function
      let result = vision.resize(imageInfoStr, targetSizeStr);

      let resize = ImageFormatConverter.convertRGBtoRGBA(result);

      // Create new ImageData
      let newImageData = new ImageData(Uint8ClampedArray.from(resize), width);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, newImageData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.20 완료
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
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
      let image = await createImageBitmap(mergeInputData, x, y, width, height);

      let canvas = new OffscreenCanvas(image.width, image.height);
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      let myData = context.getImageData(0, 0, image.width, image.height);
      console.log(myData);

      // output 저장공간
      var output1 = new ModuleData(DATA_TYPE.IMAGE, myData);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      this.setOutput(output);
      return RESULT_CODE.SUCCESS;
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
      return RESULT_CODE.WAITING_OTHER_INPUTS;
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

      return RESULT_CODE.SUCCESS;
    }
  }
};

export default filter;
