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

const vision = require("../../lib/vision/corewrap");
const constants = require("../../lib/vision/constants");
const datatypes = require("../../lib/vision/datatypes");

// import module from preload
const ref = window.ref;

var feature = {};

// 20.04.20 완료
feature[MODULES.SUBSAMPLE] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      "Grid Count": {
        type: PROP_TYPE.GROUP,
        properties: {
          Horizontal: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
          },
          Vertical: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
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

      // Get properties
      const props = this.getProperties();
      const gridNumWidth = Number(
        props.getIn(["Grid Count", "properties", "Horizontal", "value"])
      );
      const gridNumHeight = Number(
        props.getIn(["Grid Count", "properties", "Vertical", "value"])
      );

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

      // Create ImageInfo Struct
      // let data = Buffer.from(Uint8Array.from(noAlpha));
      let data = Uint8Array.from(noAlpha);
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

      // Create options
      let optionsStr = new datatypes.FeatureSubsampleOptions();
      optionsStr.is_gray = true;
      optionsStr.sub_area.point.x = 0;
      optionsStr.sub_area.point.y = 0;
      optionsStr.sub_area.size = imageInfoStr.size;
      optionsStr.grid_num.width = gridNumWidth;
      optionsStr.grid_num.height = gridNumHeight;

      let result = vision.subsample(imageInfoStr, optionsStr);

      let subsample;
      if (optionsStr.is_gray) {
        subsample = ImageFormatConverter.convertGray1toGray4(result);
      } else {
        subsample = ImageFormatConverter.convertRGBtoRGBA(result);
      }

      console.log(subsample);

      // Create new ImageData
      let newImageData = new ImageData(
        Uint8ClampedArray.from(subsample),
        gridNumWidth
      );

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

// 20.04.20 구현 중 오류
feature[MODULES.HOG] = class extends ModuleBase {
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
        value: "TRUE",
      },
      "Histogram Binning Count": {
        type: PROP_TYPE.NUMBER_EDIT,
        value: 16,
      },
      "Pixel Count Per Cell": {
        type: PROP_TYPE.GROUP,
        properties: {
          Horizontal: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 10,
          },
          Vertical: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 10,
          },
        },
      },
      "Cell Count Per Block": {
        type: PROP_TYPE.GROUP,
        properties: {
          Horizontal: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 2,
          },
          Vertical: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 2,
          },
        },
      },
      "Stride Distance": {
        type: PROP_TYPE.GROUP,
        properties: {
          Horizontal: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 12,
          },
          Vertical: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 12,
          },
        },
      },
      "Use Magnitude Value": {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "TRUE", value: "TRUE" },
          { key: 1, text: "FALSE", value: "FALSE" },
        ],
        value: "TRUE",
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

      // Get properties
      const props = this.getProperties();
      const histogramBinNum = Number(
        props.getIn(["Histogram Binning Count", "value"])
      );
      const pixelPerCellWidth = Number(
        props.getIn([
          "Pixel Count Per Cell",
          "properties",
          "Horizontal",
          "value",
        ])
      );
      const pixelPerCellHeight = Number(
        props.getIn(["Pixel Count Per Cell", "properties", "Vertical", "value"])
      );
      const cellPerBlockWidth = Number(
        props.getIn([
          "Cell Count Per Block",
          "properties",
          "Horizontal",
          "value",
        ])
      );
      const cellPerBlockHeight = Number(
        props.getIn(["Cell Count Per Block", "properties", "Vertical", "value"])
      );
      const strideDistanceWidth = Number(
        props.getIn(["Stride Distance", "properties", "Horizontal", "value"])
      );
      const strideDistanceHeight = Number(
        props.getIn(["Stride Distance", "properties", "Vertical", "value"])
      );
      const useMagnitude = props.getIn(["Use Magnitude Value", "value"]);
      const edge =
        props.getIn(["Edge Type", "value"]) === "Sobel"
          ? constants.EDGE_TYPE.EDGE_SOBEL
          : props.getIn(["Edge Type", "value"]) === "Prewitt"
          ? constants.EDGE_TYPE.EDGE_PREWITT
          : props.getIn(["Edge Type", "value"]) === "Roberts"
          ? constants.EDGE_TYPE.EDGE_ROBERTS
          : constants.EDGE_TYPE.EDGE_SOBEL;
      const useMath = props.getIn(["Use Math Function", "value"]);

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

      // Create hog option
      let optionsStr = new datatypes.HogOptions();
      optionsStr.histogram_bin_num = histogramBinNum;
      optionsStr.pixel_per_cell.width = pixelPerCellWidth;
      optionsStr.pixel_per_cell.height = pixelPerCellHeight;
      optionsStr.cell_per_block.width = cellPerBlockWidth;
      optionsStr.cell_per_block.height = cellPerBlockHeight;
      optionsStr.stride_distance.width = strideDistanceWidth;
      optionsStr.stride_distance.height = strideDistanceHeight;
      optionsStr.use_magnitude = useMagnitude;

      let optionsPtr = ref.alloc(datatypes.HogOptions, optionsStr);

      let featureOptionsStr = new datatypes.featureHogOptions();
      featureOptionsStr.blur = constants.BLUR_TYPE.BLUR_NONE;
      featureOptionsStr.edge = edge;
      featureOptionsStr.use_math = useMath;
      featureOptionsStr.hog_options = optionsPtr;

      vision.featureHog(imageInfoStr, featureOptionsStr);

      return RESULT_CODE.SUCCESS;
    }
  }
};

// 20.04.22 완료
feature[MODULES.LBP] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      "Grid Count": {
        type: PROP_TYPE.GROUP,
        properties: {
          Horizontal: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 32,
          },
          Vertical: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 32,
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

      // Get properties
      const props = this.getProperties();
      const gridNumWidth = Number(
        props.getIn(["Grid Count", "properties", "Horizontal", "value"])
      );
      const gridNumHeight = Number(
        props.getIn(["Grid Count", "properties", "Vertical", "value"])
      );

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

      // Create options
      let optionsStr = new datatypes.featureLbpOptions();
      optionsStr.grid_num.width = gridNumWidth;
      optionsStr.grid_num.height = gridNumHeight;

      let result = vision.lbp(imageInfoStr, optionsStr);

      // 이미지 관련 데이터는 아니지만 Preview를 위해서.. 얘를 어떻게 따로 분류해주징
      let lbp = ImageFormatConverter.convertGray1toGray4(result);

      console.log(constants.UNIFORM_LBP_BLOCK_SIZE, lbp);

      // Create new ImageData
      let newImageData = new ImageData(
        Uint8ClampedArray.from(lbp),
        constants.UNIFORM_LBP_BLOCK_SIZE
      );

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

export default feature;
