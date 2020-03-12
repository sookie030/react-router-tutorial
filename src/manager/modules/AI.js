// import parent
import ModuleBase from "./ModuleBase";
import * as PROP_TYPE from "../../constants/PropertyType";

// import constants
import * as DATA_TYPE from "../../constants/DataType";
import * as MODULES from "../../constants/module/Modules";

// import components
import ModuleDataChunk from "./ModuleDataChunk";
import ModuleData from "./ModuleData";

var ai = {};

ai[MODULES.NM500] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Context: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Context ID": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "-"
          },
          "Context Name": {
            type: PROP_TYPE.TEXT_EDIT,
            value: "-"
          },
          Norm: {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "L1", value: "L1" },
              { key: 1, text: "Lsup", value: "Lsup" }
            ],
            value: "L1"
          },
          Minif: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "2"
          },
          Maxif: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "2000"
          }
        }
      },

      Category: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Category ID": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: "-"
          },
          "Category Name": {
            type: PROP_TYPE.TEXT_EDIT,
            value: "-"
          }
        }
      },

      Learning: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Learning Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Once", value: "Once" },
              { key: 1, text: "Separate Auto", value: "Separate Auto" },
              { key: 2, text: "Duplicate Auto", value: "Duplicate Auto" }
            ],
            value: "Once"
          },
          "Auto Learning Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Count", value: "Count" },
              { key: 1, text: "Time", value: "Time" },
              { key: 2, text: "Novelty", value: "Novelty" }
            ],
            value: "Count"
          },
          "Auto Learning Value": {
            type: PROP_TYPE.NUMBER_EDIT,
            value: 5
          }
        }
      },

      Recognizing: {
        type: PROP_TYPE.GROUP,
        properties: {
          "Recognizing Mode": {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "Best Matched", value: "Best Matched" },
              { key: 1, text: "K-NN", value: "K-NN" }
            ],
            value: "Best Matched"
          },
          K: {
            type: PROP_TYPE.DROPDOWN,
            options: [
              { key: 0, text: "1", value: "1" },
              { key: 1, text: "3", value: "3" },
              { key: 2, text: "5", value: "5" },
              { key: 3, text: "7", value: "7" },
              { key: 4, text: "9", value: "9" }
            ],
            value: "1"
          }
        }
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
        this.getID()
      ]);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      return output;
    }
  }
};

ai[MODULES.DECISION_MAKER] = class extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    // default properties
    this.initialize({
      Category: {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "ALL", value: "ALL" },
          { key: 1, text: "1", value: "1" }
        ],
        value: "ALL"
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
        this.getID()
      ]);

      output = new ModuleDataChunk();
      output.addModuleData(output1);

      return output;
    }
  }
};

export default ai;
