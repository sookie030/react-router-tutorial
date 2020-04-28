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

const nmengine = require("../../lib/nmengine/corewrap");
const constants = require("../../lib/nmengine/constants");
const ArrayType = window.ArrayType;

var ai = {};

ai[MODULES.NM500] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      Context: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Context ID": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "1",
          },
          "Context Name": {
            type: PROP_TYPE.TEXT_EDIT,
            value: "1",
          },
          Norm: {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "L1", value: "L1" },
              { key: 1, text: "Lsup", value: "Lsup" },
            ],
            value: "L1",
          },
          Minif: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "2",
          },
          Maxif: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "2000",
          },
        },
      },

      Category: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Category ID": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "1",
          },
          "Category Name": {
            type: PROP_TYPE.TEXT_EDIT,
            value: "1",
          },
        },
      },

      Learning: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Learning Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Once", value: "Once" },
              { key: 1, text: "Separate Auto", value: "Separate Auto" },
              { key: 2, text: "Duplicate Auto", value: "Duplicate Auto" },
            ],
            value: "Once",
          },
          "Auto Learning Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Count", value: "Count" },
              { key: 1, text: "Time", value: "Time" },
              { key: 2, text: "Novelty", value: "Novelty" },
            ],
            value: "Count",
          },
          "Auto Learning Value": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 5,
          },
        },
      },

      Recognizing: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Recognizing Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Best Matched", value: "Best Matched" },
              { key: 1, text: "K-NN", value: "K-NN" },
            ],
            value: "Best Matched",
          },
          K: {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "1", value: "1" },
              { key: 1, text: "3", value: "3" },
              { key: 2, text: "5", value: "5" },
              { key: 3, text: "7", value: "7" },
              { key: 4, text: "9", value: "9" },
            ],
            value: "1",
          },
        },
      },
    });

    this.connect(0);
    this.setContext();
    // this.learnTest(10, 3, 1, 1);
    // this.learnTest(20, 3, 2, 1);
    // this.learnTest(50, 3, 5, 1);
    // this.classifyTest(10, 3, 3);
    // this.modelStatTest();
  }

  /**
   *
   * @param {*} inputs
   */
  connect = (selectedIndex) => {
    let count = 10;
    let getDevices = nmengine.getDevices(count);

    // Check result code
    if (getDevices.resultCode !== constants.SUCCESS) {
      if (getDevices.resultCode === constants.ERROR_DEVICE_NOT_FOUND) {
        console.log("[devices] Not found ");
      } else {
        console.log(
          "[devices] Failed to get device list %d\n",
          getDevices.resultCode
        );
      }
      return null;
    }

    // Check detected device count
    if (getDevices.detectedCount < 1) {
      console.log("[devices] There is no detected device");
      return null;
    }

    // Print detected device count
    console.log("[devices] %d\t detected", getDevices.detectedCount);
    for (let i = 0; i < getDevices.detectedCount; i++) {
      console.log(
        "ID: %d\t TYPE: %d\t PID: %d\t VID: %d\n",
        i,
        getDevices.devices[i].type,
        getDevices.devices[i].vid,
        getDevices.devices[i].pid
      );
    }

    // NM500 연결하기
    let connect = nmengine.connect(selectedIndex);

    if (connect.resultCode !== constants.SUCCESS) {
      console.log(
        "[nm_connect] Failed initialize NM500, Error: %d, or Not supported device",
        connect.resultCode
      );
      return null;
    }

    // NM500 초기화
    let forget = nmengine.forget();
    if (forget.resultCode !== constants.SUCCESS) {
      console.log(
        "[nm_forget] Failed initialize NM500, Error: %d, or Not supported device",
        forget.resultCode
      );
      return 0;
    }

    // 우선 Power save mode로 진입
    let ps = nmengine.powerSave();
    console.log("[set power_save mode] %d\n", ps.resultCode);
  };

  setContext = () => {
    // Get properties
    const props = this.getProperties();
    const contextID = Number(
      props.getIn(["Context", "properties", "Context ID", "value"])
    );
    const norm =
      props.getIn(["Context", "properties", "Norm", "value"]) === "L1"
        ? constants.L1
        : constants.Lsup;
    const minif = Number(
      props.getIn(["Context", "properties", "Minif", "value"])
    );
    const maxif = Number(
      props.getIn(["Context", "properties", "Maxif", "value"])
    );

    let sc = nmengine.setContext(contextID, norm, minif, maxif);
    if (sc.resultCode === constants.SUCCESS) {
      let ctx = sc.ctx;
      console.log(
        "[tcSetContext] CONTEXT: %d, NORM: %d, MINIF: %d, MAXIF: %d",
        ctx.context,
        ctx.norm,
        ctx.minif,
        ctx.maxif
      );
    } else {
      console.log(
        "[tcSetContext] Error: Failed to set context. %d",
        sc.resultCode
      );
    }
  };

  learnTest = (data, size, category, queryAffected) => {
    let vector = Array(constants.NEURON_MEMORY).fill(0);

    // Make input vector
    console.log("[tcLearn] VECTOR: ");
    for (let i = 0; i < size; i++) {
      vector[i] = data;
      console.log(" " + data);
    }
    console.log(", CAT: " + category);

    // Training
    let learn = nmengine.learn(vector, category, queryAffected);

    // Training result
    if (learn.resultCode === constants.SUCCESS) {
      let req = learn.req;
      console.log(",\tRESULT: %d\n", req.status);

      if (queryAffected === 1) {
        for (let i = 0; i < req.affected_count; i++) {
          console.log(
            "affected neuron nid: %d, cat: %d, aif: %d\n",
            req.affected_neurons[i].nid,
            req.affected_neurons[i].cat,
            req.affected_neurons[i].aif
          );
        }
      }
    } else {
      console.log("[tcLearn] Error: Failed to learn. %d\n", learn.resultCode);
    }
  };

  classifyTest = (data, size, k) => {
    let vector = Array(constants.NEURON_MEMORY).fill(0);

    // Make input vector
    console.log("[tcClassify] VECTOR: ");
    for (let i = 0; i < size; i++) {
      vector[i] = data;
      console.log(" " + data);
    }
    console.log(", k: " + k + "\n");
    console.log(vector);
    let classify = nmengine.classify(k, vector);

    // Classify result
    if (classify.resultCode === constants.SUCCESS) {
      let req = classify.req;

      for (let i = 0; i < req.matched_count; i++) {
        console.log(
          "Matched[%d] NID: %d DISTANCE: %d CAT: %d",
          i,
          req.nid[i],
          req.distance[i],
          req.category[i]
        );
      }

      console.log("NETWORK STATUS: %d\n", req.status);
    } else {
      console.log(
        "[tcClassify] Error: Failed to classify. %d\n",
        classify.resultCode
      );
    }
  };

  modelStatTest = () => {
    let uint16Array = ArrayType("uint16");

    let gmi = nmengine.getModelInfo();
    let mi = gmi.modelInfo;
    console.log(
      "[tcModelAnalysis] used: %d, max ctx: %d, max cat: %d\n",
      mi.count,
      mi.max_context,
      mi.max_category
    );

    let gms = nmengine.getModelStat(1, mi.max_category);
    let ms = gms.modelStat;

    // Get values from Buffer
    let bytes = (mi.max_category + 1) * uint16Array.BYTES_PER_ELEMENT;
    let histoCat = uint16Array(ms.histo_cat.reinterpret(bytes));
    let histoDeg = uint16Array(ms.histo_deg.reinterpret(bytes));

    console.log("<tcModelAnalysis histoCat>");
    console.log(histoCat);

    let bytes2 = (mi.max_category + 1) * Uint16Array.BYTES_PER_ELEMENT;
    let histoCat2 = new Uint16Array(ms.histo_cat.reinterpret(bytes2));

    console.log("<msStr histo_cat deref3>");
    console.log(histoCat2);
    console.log("<msStr histo_cat deref3 end>");

    let test = new Uint16Array([1, 2, 3]);
    console.log(test);

    // Get values from Buffer
    let bytes3 = (mi.max_category + 1) * uint16Array.BYTES_PER_ELEMENT;
    let histoCat3 = uint16Array(ms.histo_cat.reinterpret(bytes3));

    console.log("<tcModelAnalysis histoCat>");
    console.log(histoCat);
  };

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

      // // 20.04.07 ffi-napi test
      // let count = 10;
      // let getDevices = nmengine.getDevices(count);

      // // Check result code
      // if (getDevices.resultCode !== constants.SUCCESS) {
      //   if (getDevices.resultCode === constants.ERROR_DEVICE_NOT_FOUND) {
      //     console.log("[devices] Not found ");
      //   } else {
      //     console.log(
      //       "[devices] Failed to get device list %d\n",
      //       getDevices.resultCode
      //     );
      //   }
      //   return 0;
      // }

      // // Print detected device count
      // console.log("[devices] %d\t detected", getDevices.detectedCount);
      // for (let i = 0; i < getDevices.detectedCount; i++) {
      //   console.log(
      //     "ID: %d\t TYPE: %d\t PID: %d\t VID: %d\n",
      //     i,
      //     getDevices.devices[i].type,
      //     getDevices.devices[i].vid,
      //     getDevices.devices[i].pid
      //   );
      // }

      // /**
      //  * nm_connect
      //  */
      // let connect = nmengine.connect();

      // if (connect.resultCode !== constants.SUCCESS) {
      //   console.log(
      //     "[nm_connect] Failed initialize NM500, Error: %d, or Not supported device",
      //     connect.resultCode
      //   );
      //   return 0;
      // }

      // /**
      //  * nm_set_context
      //  */
      // this.setContext();

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

ai[MODULES.DECISION_MAKER] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      Category: {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "ALL", value: "ALL" },
          { key: 1, text: "1", value: "1" },
        ],
        value: "ALL",
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

      return RESULT_CODE.SUCCESS;
    }
  }
};

ai[MODULES.SCANNER] = class extends ModuleBase {
  constructor() {
    super();

    // default properties
    this.initialize({
      ROI: {
        type: PROP_TYPE.GROUP,
        properties: {
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
          },
        },
      },
      Stride: {
        type: PROP_TYPE.GROUP,
        properties: {
          x: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 16,
          },
          y: {
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

      // merge는 아직 구현 X. 우선 ROI는 첫 번쨰 input만 사용하도록 구현한다.
      let mergeInputData = inputs[0].getModuleDataList()[0].getData();

      // Get properties
      const props = this.getProperties();
      const roiWidth = Number(
        props.getIn(["ROI", "properties", "Width", "value"])
      );
      const roiHeight = Number(
        props.getIn(["ROI", "properties", "Height", "value"])
      );
      const strideX = Number(
        props.getIn(["Stride", "properties", "x", "value"])
      );
      const strideY = Number(
        props.getIn(["Stride", "properties", "y", "value"])
      );

      // Calculate scanning count
      const scanCountCol =
        (mergeInputData.width - roiWidth) / strideX > 0
          ? Math.floor((mergeInputData.width - roiWidth) / strideX + 1)
          : 0;
      const scanCountRow =
        (mergeInputData.height - roiHeight) / strideY > 0
          ? Math.floor((mergeInputData.height - roiHeight) / strideY + 1)
          : 0;

      let canvas = new OffscreenCanvas(
        mergeInputData.width,
        mergeInputData.height
      );
      let context = canvas.getContext("2d");
      context.putImageData(mergeInputData, 0, 0);

      // Start scanning
      let dataList = [];
      let x = 0;
      let y = 0;

      for (let row = 0; row < scanCountRow; row++) {
        y = row * strideY;
        for (let col = 0; col < scanCountCol; col++) {
          x = col * strideX;
          let roiData = context.getImageData(x, y, roiWidth, roiHeight);
          console.log("[scanner] ", x, y, roiWidth, roiHeight);

          // RGBA -> RGB (Alpha 제외)
          let noAlpha = Array.from(
            ImageFormatConverter.convertRGBAtoRGB(roiData.data)
          );

          dataList.push({ data: noAlpha, category: null });
        }
      }

      // Classify
      for (let i = 0; i < dataList.length; i++) {

      // vector값 이용하여 classify 
      let classify = nmengine.classify(1, dataList[i].data);

      // Classify result
      if (classify.resultCode === constants.SUCCESS) {
        let req = classify.req;
        let category = req.matched_count > 0 ? req.matched_count[0] : null;

        // classify 결과 카테고리를 저장
        dataList[i].category = category;
        console.log(category);
      } else {
        console.log(
          "[classify] Error: Failed to classify. %d\n",
          classify.resultCode
        );
      }
      }
      
      console.log(dataList);

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

export default ai;
