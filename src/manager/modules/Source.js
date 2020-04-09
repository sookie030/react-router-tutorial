// import parent
import SourceModuleBase from "./SourceModuleBase";
import * as PROP_TYPE from "../../constants/PropertyType";

// import constants
import * as DATA_TYPE from "../../constants/DataType";
import { MODULES } from "../../constants/ModuleInfo";

// import components
import ModuleDataChunk from "./ModuleDataChunk";
import ModuleData from "./ModuleData";

// import utils
import * as DeviceManager from "../../utils/DeviceManager";

const fs = window.fs;
var source = {};

source[MODULES.CAMERA] = class extends SourceModuleBase {
  constructor() {
    super();
    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      Camera: {
        type: PROP_TYPE.DROPDOWN,
        options: [],
        value: "0",
      },

      "Preview Size": {
        type: PROP_TYPE.DROPDOWN,
        disabled: "",
        options: [
          { key: 0, text: "800x450", value: "800x450" },
          { key: 1, text: "720x720", value: "720x720" },
          { key: 2, text: "720x480", value: "720x480" },
          { key: 3, text: "640x480", value: "640x480" },
          { key: 4, text: "352x288", value: "352x288" },
          { key: 5, text: "320x240", value: "320x240" },
          { key: 6, text: "256x144", value: "256x144" },
          { key: 7, text: "176x144", value: "176x144" },
        ],
        value: "800x450",
      },
    });

    // Dropdown 옵션 설정
    this.setCameraOptions(0);
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  setCameraOptions = (selectedIndex) => {
    DeviceManager.createDeviceOptions("videoinput").then((options) => {
      let newProperties = this.getProperties()
        .setIn(["Camera", "options"], options)
        .setIn(["Camera", "value"], selectedIndex);
      this.setProperties(newProperties);
    });
  };

  stopStream = () => {
    if (this.track !== null) {
      console.log("stopStream");
      this.track.stop();

      this.stream = null;
      this.track = null;
      // this.imageCapture = null;
    }
  };

  updateStream = async () => {
    this.stopStream();

    const props = this.getProperties();
    const selectedDeviceIndex = props.getIn(["Camera", "value"]);
    const selectedDeviceID = props.getIn([
      "Camera",
      "options",
      selectedDeviceIndex,
    ]).key;

    const selectedPreviewSize = props.getIn(["Preview Size", "value"]);
    var selectedPreviewSizeArray = selectedPreviewSize.split("x");

    const constraints = {
      audio: false,
      video: {
        deviceId: selectedDeviceID,
        width: selectedPreviewSizeArray[0],
        height: selectedPreviewSizeArray[1],
      },
    };

    // Video Stream 얻어오기
    this.stream = await DeviceManager.getStream(constraints);
    this.track = this.stream.getVideoTracks()[0];
  };

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async (inputs) => {
    let output;

    if (this.stream === null || this.isPropChanged) {
      const props = this.getProperties();
      const selectedDeviceIndex = props.getIn(["Camera", "value"]);
      const selectedDeviceID = props.getIn([
        "Camera",
        "options",
        selectedDeviceIndex,
      ]).key;

      const selectedPreviewSize = props.getIn(["Preview Size", "value"]);
      let selectedPreviewSizeArray = selectedPreviewSize.split("x");

      const constraints = {
        audio: false,
        video: {
          deviceId: selectedDeviceID,
          width: selectedPreviewSizeArray[0],
          height: selectedPreviewSizeArray[1],
        },
      };

      // Video Stream 얻어오기
      this.stream = await DeviceManager.getStream(constraints);
      this.track = this.stream.getVideoTracks()[0];
    }

    try {
      let imageCapture = new ImageCapture(this.track);
      let image = await imageCapture.grabFrame();
      if (
        image.width !== this.track.getSettings().width ||
        image.height !== this.track.getSettings().height
      ) {
        image = await createImageBitmap(image, {
          resizeWidth: this.track.getConstraints().width,
          resizeHeight: this.track.getConstraints().height,
          resizeQuality: "high",
        });
      }

      // 20.03.23 test
      let canvas = new OffscreenCanvas(image.width, image.height);
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      let myData = context.getImageData(0, 0, image.width, image.height);
      console.log(myData);

      // ImageBitmap을 Output으로 내보내고, PNG로 만드는 과정은 PipelineManager > getOutput에서 수행한다.
      var output1 = new ModuleData(DATA_TYPE.IMAGE, myData);
      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return output;
    } catch (e) {
      // Stream 재시작 혹은 Source의 속성값을 변경한 경우, 일시적으로 track이 비어있을 수 있음.
      if (this.track === null) {
        this.setOutput(this.getOutput());
        return this.getOutput();
      }

      this.setOutput(null);
      return e;
    }

    // try {
    //   let imageCapture = new ImageCapture(this.track);
    //   let image = await imageCapture.grabFrame();

    //   if (
    //     image.width !== this.track.getSettings().width ||
    //     image.height !== this.track.getSettings().height
    //   ) {
    //     image = await createImageBitmap(image, {
    //       resizeWidth: this.track.getConstraints().width,
    //       resizeHeight: this.track.getConstraints().height,
    //       resizeQuality: "high"
    //     });
    //   }

    //   // ImageBitmap을 Output으로 내보내고, PNG로 만드는 과정은 PipelineManager > getOutput에서 수행한다.
    //   var output1 = new ModuleData(DATA_TYPE.IMAGE, image);
    //   output = new ModuleDataChunk();
    //   output.addModuleData(output1);

    //   // Output으로 저장
    //   this.setOutput(output);

    //   return output;
    // } catch (e) {
    //   // Stream 재시작 혹은 Source의 속성값을 변경한 경우, 일시적으로 track이 비어있을 수 있음.
    //   if (this.track === null) {
    //     this.setOutput(this.getOutput());
    //     return this.getOutput();
    //   }

    //   this.setOutput(null);
    //   return e;
    // }
  };
};

source[MODULES.FACE_CAMERA] = class extends SourceModuleBase {
  constructor() {
    super();

    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      Camera: {
        type: PROP_TYPE.DROPDOWN,
        options: [],
        value: "0",
      },

      "Preview Size": {
        type: PROP_TYPE.DROPDOWN,
        disabled: "",
        options: [
          { key: 0, text: "800x450", value: "800x450" },
          { key: 1, text: "720x720", value: "720x720" },
          { key: 2, text: "720x480", value: "720x480" },
          { key: 3, text: "640x480", value: "640x480" },
          { key: 4, text: "352x288", value: "352x288" },
          { key: 5, text: "320x240", value: "320x240" },
          { key: 6, text: "256x144", value: "256x144" },
          { key: 7, text: "176x144", value: "176x144" },
        ],
        value: "800x450",
      },
    });

    // Dropdown 옵션 설정
    this.setCameraOptions(0);
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  setCameraOptions = (selectedIndex) => {
    DeviceManager.createDeviceOptions("videoinput").then((options) => {
      let newProperties = this.getProperties()
        .setIn(["Camera", "options"], options)
        .setIn(["Camera", "value"], selectedIndex);
      this.setProperties(newProperties);
    });
  };

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async (inputs) => {
    let output;

    if (this.stream === null || this.isPropChanged) {
      const props = this.getProperties();
      const selectedDeviceIndex = props.getIn(["Camera", "value"]);
      const selectedDeviceID = props.getIn([
        "Camera",
        "options",
        selectedDeviceIndex,
      ]).key;

      const selectedPreviewSize = props.getIn(["Preview Size", "value"]);
      let selectedPreviewSizeArray = selectedPreviewSize.split("x");

      const constraints = {
        audio: false,
        video: {
          deviceId: selectedDeviceID,
          width: selectedPreviewSizeArray[0],
          height: selectedPreviewSizeArray[1],
        },
      };

      // Video Stream 얻어오기
      this.stream = await DeviceManager.getStream(constraints);
      this.track = this.stream.getVideoTracks()[0];
    }

    try {
      let imageCapture = new ImageCapture(this.track);
      let image = await imageCapture.grabFrame();

      if (
        image.width !== this.track.getSettings().width ||
        image.height !== this.track.getSettings().height
      ) {
        image = await createImageBitmap(image, {
          resizeWidth: this.track.getConstraints().width,
          resizeHeight: this.track.getConstraints().height,
          resizeQuality: "high",
        });
      }

      // ImageBitmap을 Output으로 내보내고, PNG로 만드는 과정은 PipelineManager > getOutput에서 수행한다.
      var output1 = new ModuleData(DATA_TYPE.IMAGE, image);
      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return output;
    } catch (e) {
      // Stream 재시작 혹은 Source의 속성값을 변경한 경우, 일시적으로 track이 비어있을 수 있음.
      if (this.track === null) {
        this.setOutput(this.getOutput());
        return this.getOutput();
      }

      this.setOutput(null);
      return e;
    }
  };

  stopStream = () => {
    if (this.track !== null) {
      console.log("stopStream");
      this.track.stop();

      this.stream = null;
      this.track = null;
      // this.imageCapture = null;
    }
  };

  updateStream = async () => {
    this.stopStream();

    const props = this.getProperties();
    const selectedDeviceIndex = props.getIn(["Camera", "value"]);
    const selectedDeviceID = props.getIn([
      "Camera",
      "options",
      selectedDeviceIndex,
    ]).key;

    const selectedPreviewSize = props.getIn(["Preview Size", "value"]);
    var selectedPreviewSizeArray = selectedPreviewSize.split("x");

    const constraints = {
      audio: false,
      video: {
        deviceId: selectedDeviceID,
        width: selectedPreviewSizeArray[0],
        height: selectedPreviewSizeArray[1],
      },
    };

    // Video Stream 얻어오기
    this.stream = await DeviceManager.getStream(constraints);
    this.track = this.stream.getVideoTracks()[0];
  };
};

source[MODULES.FILE_LOADER] = class extends SourceModuleBase {
  constructor() {
    super();

    // 20.03.04 파일 리스트 중 어디까지 다음 모듈에 전달했는강
    this._index = 0;

    // 20.03.04 리스트 중 선택한 리스트는?
    this._selectedFileList = [];

    // 초기화
    this.initialize({
      Directory: {
        type: PROP_TYPE.SELECT_DIRECTORY,
        value: "/Users/minsook/Desktop/dtest",
      },
      Option: {
        type: PROP_TYPE.DROPDOWN,
        disabled: "",
        options: [
          { key: 0, text: "All", value: "All" },
          { key: 1, text: "Selected Only", value: "Selected Only" },
        ],
        value: "All",
      },
      "File List": {
        type: PROP_TYPE.LIST,
        // 디렉토리 내 전체 리스트
        value: [],
        // Option == Selected only인 경우, 선택된 파일 리스트
        // selected: []
      },
    });
  }

  getIndex() {
    return this._index;
  }

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async (inputs) => {
    let output;

    // 파일 리스트
    let inputList = this.getProperties()
      .getIn(["File List", "value"])
      .filter((file) => file.selected === true);

    // imageBitmap 만들기
    let imgElement = new Image();
    imgElement.src = inputList[this._index].thumbnail;
    let image = await createImageBitmap(imgElement);

    // 20.04.06 test
    let canvas = new OffscreenCanvas(image.width, image.height);
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    let imageData = context.getImageData(0, 0, image.width, image.height);

    // RGBA -> RGB (Alpha 제외)
    // map 말고 forEach 사용한 이유: element === 0 이면 return 0이 되어 데이터가 유실됨..
    let noAlpha = [];
    imageData.data.forEach((elem, index) => {
      if ((index + 1) % 4 > 0) {
        noAlpha.push(elem);
      }
    });

    let uint8Data = Uint8Array.from(noAlpha);

    console.log(imageData.data.length);
    console.log(uint8Data.length);

    fs.writeFile(
      `/Users/minsook/Desktop/text_${image.width}_${image.height}_2.txt`,
      noAlpha.toString(),
      "utf8",
      (err) => {
        if (err) throw err;
        console.log(imageData.data.length);
        console.log(noAlpha.length);
        console.log("save file");
      }
    );

    // output 만들기
    var output1 = new ModuleData(DATA_TYPE.IMAGE, imageData);
    output = new ModuleDataChunk();
    output.addModuleData(output1);

    // Output으로 저장
    this.setOutput(output);

    // 현재 파일이 마지막인지 확인
    if (this._index === inputList.length - 1) {
      // index 초기화
      this._index = 0;
      this.setStopPipelineFlag(false);
    } else {
      // 다음 파일이 마지막인지 확인
      if (this._index === inputList.length - 2) {
        // 파이프라인 중단 플래그 설정
        console.log("파이프라인 중단 플래그 설정 (예약)");
        this.setStopPipelineFlag(true);
      }
      this._index++;
    }

    // output 내보내기
    return output;
  };
};

source[MODULES.MIC] = class extends SourceModuleBase {
  constructor() {
    super();
    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      Microphone: {
        type: PROP_TYPE.DROPDOWN,
        options: [],
        value: "0",
      },
    });

    // Dropdown 옵션 설정
    this.setOptions(0);
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  setOptions = (selectedIndex) => {
    DeviceManager.createDeviceOptions("audioinput").then((options) => {
      let newProperties = this.getProperties()
        .setIn(["Microphone", "options"], options)
        .setIn(["Microphone", "value"], selectedIndex);
      this.setProperties(newProperties);
    });
  };

  stopStream = () => {
    if (this.track !== null) {
      console.log("stopStream");
      this.track.stop();

      this.stream = null;
      this.track = null;
      // this.imageCapture = null;
    }
  };

  updateStream = async () => {
    this.stopStream();

    const props = this.getProperties();
    const selectedDeviceIndex = props.getIn(["Microphone", "value"]);
    const selectedDeviceID = props.getIn([
      "Microphone",
      "options",
      selectedDeviceIndex,
    ]).key;

    // const selectedPreviewSize = props.getIn(['Preview Size', 'value']);
    // var selectedPreviewSizeArray = selectedPreviewSize.split('x');

    /**
     * <constraints>
     * autoGainControl: A ConstrainBoolean object which specifies whether automatic gain control is preferred and/or required.
     * channelCount: A ConstrainLong specifying the channel count or range of channel counts which are acceptable and/or required.
     * echoCancellation: A ConstrainBoolean object specifying whether or not echo cancellation is preferred and/or required.
     * latency: A ConstrainDouble specifying the latency or range of latencies which are acceptable and/or required.
     * noiseSuppression: A ConstrainBoolean which specifies whether noise suppression is preferred and/or required.
     * sampleRate: A ConstrainLong specifying the sample rate or range of sample rates which are acceptable and/or required.
     * sampleSize: A ConstrainLong specifying the sample size or range of sample sizes which are acceptable and/or required.
     * volume: A ConstrainDouble specifying the volume or range of volumes which are acceptable and/or required.
     */
    const constraints = {
      audio: true,
      video: {
        deviceId: selectedDeviceID,
      },
    };

    // Audio Stream 얻어오기
    this.stream = await DeviceManager.getStream(constraints);
    this.track = this.stream.getAudioTracks()[0];
  };

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async (inputs) => {
    let output;

    if (this.stream === null || this.isPropChanged) {
      const props = this.getProperties();
      const selectedDeviceIndex = props.getIn(["Microphone", "value"]);
      const selectedDeviceID = props.getIn([
        "Microphone",
        "options",
        selectedDeviceIndex,
      ]).key;

      const constraints = {
        audio: true,
        video: {
          deviceId: selectedDeviceID,
        },
      };

      // Stream 얻어오기
      this.stream = await DeviceManager.getStream(constraints);
      this.track = this.stream.getAudioTracks()[0];
    }

    try {
      let imageCapture = new ImageCapture(this.track);
      let image = await imageCapture.grabFrame();

      if (
        image.width !== this.track.getSettings().width ||
        image.height !== this.track.getSettings().height
      ) {
        image = await createImageBitmap(image, {
          resizeWidth: this.track.getConstraints().width,
          resizeHeight: this.track.getConstraints().height,
          resizeQuality: "high",
        });
      }

      // ImageBitmap을 Output으로 내보내고, PNG로 만드는 과정은 PipelineManager > getOutput에서 수행한다.
      var output1 = new ModuleData(DATA_TYPE.IMAGE, image);
      output = new ModuleDataChunk();
      output.addModuleData(output1);

      // Output으로 저장
      this.setOutput(output);

      return output;
    } catch (e) {
      // Stream 재시작 혹은 Source의 속성값을 변경한 경우, 일시적으로 track이 비어있을 수 있음.
      if (this.track === null) {
        this.setOutput(this.getOutput());
        return this.getOutput();
      }

      this.setOutput(null);
      return e;
    }
  };
};

export default source;
