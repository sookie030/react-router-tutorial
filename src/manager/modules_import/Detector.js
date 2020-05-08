// import parent
import ModuleBase from './ModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as DATA_TYPE from "../../constants/DataType";
import * as RESULT_CODE from "../../constants/ResultCode";
import { MODULES } from '../../constants/ModuleInfo';

// import components
import ModuleDataChunk from './ModuleDataChunk';
import ModuleData from './ModuleData';

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

var detector = {};

// 20.04.23 추가하였으나.. 오류
detector[MODULES.FACE_DETECTOR] = class extends ModuleBase {
    constructor() {
        super();

        // default properties
        this.initialize({
            'Filter': {
                'type': PROP_TYPE.DROPDOWN,
                'options': [
                    { key: 0, text: 'Face', value: 'Face'}
                ],
                'value': 'Face'
            },
            'Minimum Size': {
                'type': PROP_TYPE.GROUP,
                'properties': {
                    'Width': {
                        'type': PROP_TYPE.NUMBER_EDIT,
                        'value': 32
                    },
                    'Height': {
                        'type': PROP_TYPE.NUMBER_EDIT,
                        'value': 32
                    }
                }
            },
            'Maximum Size': {
                'type': PROP_TYPE.GROUP,
                'properties': {
                    'Width': {
                        'type': PROP_TYPE.NUMBER_EDIT,
                        'value': 32
                    },
                    'Height': {
                        'type': PROP_TYPE.NUMBER_EDIT,
                        'value': 32
                    }
                }
            },
            'Scale Factor Ratio': {
                'type': PROP_TYPE.NUMBER_EDIT,
                'value': 1.1
            },
            'Threshold Ratio': {
                'type': PROP_TYPE.NUMBER_EDIT,
                'value': 80
            },
            'Minimum Neighbors': {
                'type': PROP_TYPE.NUMBER_EDIT,
                'value': 2
            }
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

      // Create haar option
      const props = this.getProperties();
      const minWidth = Number(props.getIn(["Minimum Size", "Width", "value"]));
      const minHeight = Number(props.getIn(["Minimum Size", "Height", "value"]));
      const maxWidth = Number(props.getIn(["Maximum Size", "Width", "value"]));
      const maxHeight = Number(props.getIn(["Maximum Size", "Height", "value"]));
      const scaleFactorRatio = Number(props.getIn(["Scale Factor Ratio", "value"]));
      const thresholdRatio = Number(props.getIn(["Threshold Ratio", "value"]));
      const minNeighbors = Number(props.getIn(["Minimum Neighbors", "value"]));

      let optionsStr = new datatypes.HaarOptions();
      optionsStr.min_size = new datatypes.SizeInfo({
        width: minWidth,
        height: minHeight
      });
      optionsStr.max_size = new datatypes.SizeInfo({
        width: maxWidth,
        height: maxHeight
      });
      optionsStr.scale_factor_ratio = scaleFactorRatio;
      optionsStr.threshold_ratio = thresholdRatio;
      optionsStr.min_neighbors = minNeighbors;

      // Call functioon
      let result = vision.detectFace(imageInfoStr, optionsStr);

      // Create RGBA (Gray)
      let grayscale = Uint8ClampedArray.from(
        ImageFormatConverter.convertGray1toGray4ClampedArray(result)
      );
      console.log(result);
      console.log(grayscale);


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
}

export default detector;