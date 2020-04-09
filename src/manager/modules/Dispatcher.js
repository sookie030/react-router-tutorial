// import parent
import ModuleBase from "./ModuleBase";
import * as PROP_TYPE from "../../constants/PropertyType";

// import constants
import { MODULES } from '../../constants/ModuleInfo';
import * as DATA_TYPE from "../../constants/DataType";

// import components
import ModuleDataChunk from "./ModuleDataChunk";

const fs = window.fs;

var dispatcher = {};

dispatcher[MODULES.FILE_SAVER] = class extends ModuleBase {
  constructor() {
    super();

    this.stream = null;
    this.track = null;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    // 초기화
    this.initialize({
      Directory: {
        type: PROP_TYPE.SELECT_DIRECTORY,
        value: "-",
        list: []
      }
    });
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async inputs => {
    // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
    let mergeInputData = inputs[0].getModuleDataList()[0].getData();
    let inputType = inputs[0].getModuleDataList()[0].getType();
    let directory = this.getProperties().getIn(["Directory", "value"]);

    fs.exists(directory, isExists => {
      if (isExists) {
        switch (inputType) {
          case DATA_TYPE.IMAGE:

          this.canvas.width = mergeInputData.width;
          this.canvas.height = mergeInputData.height;

            // canvas에 그리기
            this.context.drawImage(
              mergeInputData,
              0,
              0,
              mergeInputData.width,
              mergeInputData.height
            );
            // Get the DataUrl from the Canvas
            let img = this.canvas.toDataURL("image/png");
            
            // strip off the data: url prefix to get just the base64-encoded bytes
            var data = img.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, "base64");

            let fileName = new Date().getTime() + ".png";

            fs.writeFile(directory.concat('/', fileName), buf, err => {
              if (err) throw err;
              console.log('save file');
            });

            break;
          default:
            break;
        }
      }
    });

    let output = new ModuleDataChunk();
    this.setOutput(output);
    return output;
  };
};

export default dispatcher;
