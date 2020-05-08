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

const fs = window.fs;

var dispatcher = {};

// 20.03.. 언젠가 완료
dispatcher[MODULES.FILE_SAVER] = class extends ModuleBase {
  constructor() {
    super();

    // this.stream = null;
    // this.track = null;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    // 초기화
    this.initialize({
      Directory: {
        type: PROP_TYPE.SELECT_DIRECTORY,
        value: "-",
        list: [],
      },
    });
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async (inputs) => {
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
      console.log(mergeInputData);

      // RGBA -> RGB (Alpha 제외)
      let noAlpha = Uint8Array.from(
        ImageFormatConverter.convertRGBAtoRGB(mergeInputData.data)
      );

      // Get properties
      let directory = this.getProperties().getIn(["Directory", "value"]);

      // imageBitmap 만들기
      this.canvas.width = mergeInputData.width;
      this.canvas.height = mergeInputData.height;
      let image = await createImageBitmap(mergeInputData);

      fs.exists(directory, (isExists) => {
        if (isExists) {
          // canvas에 그리기
          this.context.drawImage(
            image,
            0,
            0,
            mergeInputData.width,
            mergeInputData.height
          );
          // Get the DataUrl from the Canvas
          let url = this.canvas.toDataURL("image/png");

          // strip off the data: url prefix to get just the base64-encoded bytes
          var data = url.replace(/^data:image\/\w+;base64,/, "");
          var buf = new Buffer(data, "base64");

          let fileName = new Date().getTime() + ".png";

          fs.writeFile(directory.concat("/", fileName), buf, (err) => {
            if (err) throw err;
            console.log("save file");
          });
        }
      });

      let output = new ModuleDataChunk();
      this.setOutput(output);
      return RESULT_CODE.SUCCESS;
    }
  };
};
export default dispatcher;
