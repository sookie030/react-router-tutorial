// import parent
import SourceModuleBase from './SourceModuleBase';
import * as PROP_TYPE from '../../constants/PropertyType';

// import constants
import * as DATA_TYPE from '../../constants/DataType';
import * as MODULES from '../../constants/module/Modules';

// import components
import ModuleDataChunk from './ModuleDataChunk';
import ModuleData from './ModuleData';

// import utils
import * as DeviceManager from '../../utils/DeviceManager';

var source = {};

source[MODULES.CAMERA] = class extends SourceModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      Camera: {
        type: PROP_TYPE.DROPDOWN,
        options: [],
        value: '0',
      },

      'Preview Size': {
        type: PROP_TYPE.DROPDOWN,
        disabled: '',
        options: [
          { key: 0, text: '800x450', value: '800x450' },
          { key: 1, text: '720x720', value: '720x720' },
          { key: 2, text: '720x480', value: '720x480' },
          { key: 3, text: '640x480', value: '640x480' },
          { key: 4, text: '352x288', value: '352x288' },
          { key: 5, text: '320x240', value: '320x240' },
          { key: 6, text: '256x144', value: '256x144' },
          { key: 7, text: '176x144', value: '176x144' },
        ],
        value: '800x450',
      },
    });

    // Dropdown 옵션 설정
    this.setCameraOptions(0);
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  setCameraOptions = selectedIndex => {
    DeviceManager.createDeviceOptions('videoinput').then(options => {
      let newProperties = this.getProperties()
        .setIn(['Camera', 'options'], options)
        .setIn(['Camera', 'value'], selectedIndex);
      this.setProperties(newProperties);
    });
  };

  stopStream = () => {
    if (this.track !== null) {
      console.log('stopStream');
      this.track.stop();

      this.stream = null;
      this.track = null;
      // this.imageCapture = null;
    }
  };

  updateStream = async () => {
    this.stopStream();

    const props = this.getProperties();
    const selectedDeviceIndex = props.getIn(['Camera', 'value']);
    const selectedDeviceID = props.getIn([
      'Camera',
      'options',
      selectedDeviceIndex,
    ]).key;

    const selectedPreviewSize = props.getIn(['Preview Size', 'value']);
    var selectedPreviewSizeArray = selectedPreviewSize.split('x');

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
  process = async inputs => {
    let output;

    if (this.stream === null || this.isPropChanged) {
      const props = this.getProperties();
      const selectedDeviceIndex = props.getIn(['Camera', 'value']);
      const selectedDeviceID = props.getIn([
        'Camera',
        'options',
        selectedDeviceIndex,
      ]).key;

      const selectedPreviewSize = props.getIn(['Preview Size', 'value']);
      let selectedPreviewSizeArray = selectedPreviewSize.split('x');

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
          resizeQuality: 'high',
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

source[MODULES.FACE_CAMERA] = class extends SourceModuleBase {
  constructor(id, name, group) {
    super(id, name, group);

    this.stream = null;
    this.track = null;

    // 초기화
    this.initialize({
      Camera: {
        type: PROP_TYPE.DROPDOWN,
        options: [],
        value: '0',
      },

      'Preview Size': {
        type: PROP_TYPE.DROPDOWN,
        disabled: '',
        options: [
          { key: 0, text: '800x450', value: '800x450' },
          { key: 1, text: '720x720', value: '720x720' },
          { key: 2, text: '720x480', value: '720x480' },
          { key: 3, text: '640x480', value: '640x480' },
          { key: 4, text: '352x288', value: '352x288' },
          { key: 5, text: '320x240', value: '320x240' },
          { key: 6, text: '256x144', value: '256x144' },
          { key: 7, text: '176x144', value: '176x144' },
        ],
        value: '800x450',
      },
    });

    // Dropdown 옵션 설정
    this.setCameraOptions(0);
  }

  /**
   * 카메라 디바이스 탐색하여 Droopdown 옵션으로 설정
   */
  setCameraOptions = selectedIndex => {
    DeviceManager.createDeviceOptions('videoinput').then(options => {
      let newProperties = this.getProperties()
        .setIn(['Camera', 'options'], options)
        .setIn(['Camera', 'value'], selectedIndex);
      this.setProperties(newProperties);
    });
  };

  /**
   * 모듈 실행
   * @param {List<ModuleDataChunk>} inputs
   */
  process = async inputs => {
    let output;

    if (this.stream === null || this.isPropChanged) {
      const props = this.getProperties();
      const selectedDeviceIndex = props.getIn(['Camera', 'value']);
      const selectedDeviceID = props.getIn([
        'Camera',
        'options',
        selectedDeviceIndex,
      ]).key;

      const selectedPreviewSize = props.getIn(['Preview Size', 'value']);
      let selectedPreviewSizeArray = selectedPreviewSize.split('x');

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
          resizeQuality: 'high',
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
      console.log('stopStream');
      this.track.stop();

      this.stream = null;
      this.track = null;
      // this.imageCapture = null;
    }
  };

  updateStream = async () => {
    this.stopStream();

    const props = this.getProperties();
    const selectedDeviceIndex = props.getIn(['Camera', 'value']);
    const selectedDeviceID = props.getIn([
      'Camera',
      'options',
      selectedDeviceIndex,
    ]).key;

    const selectedPreviewSize = props.getIn(['Preview Size', 'value']);
    var selectedPreviewSizeArray = selectedPreviewSize.split('x');

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
  constructor(id, name, group) {
    super(id, name, group);

    // 20.03.04 파일 리스트 중 어디까지 다음 모듈에 전달했는강
    this._index = 0;

    // 20.03.04 리스트 중 선택한 리스트는?
    this._selectedFileList = [];

    // 초기화
    this.initialize({
      Directory: {
        type: PROP_TYPE.SELECT_DIRECTORY,
        value: '-',
      },
      Option: {
        type: PROP_TYPE.DROPDOWN,
        disabled: '',
        options: [
          { key: 0, text: 'All', value: 'All' },
          { key: 1, text: 'Selected Only', value: 'Selected Only' },
        ],
        value: 'All',
      },
      'File List': {
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
  process = async inputs => {
    let output;

    // 파일 리스트
    let inputList = this.getProperties()
      .getIn(['File List', 'value'])
      .filter(file => file.selected === true);

    // imageBitmap 만들기
    let imgElement = new Image();
    imgElement.src = inputList[this._index].thumbnail;
    let image = await createImageBitmap(imgElement);

    // output 만들기
    var output1 = new ModuleData(DATA_TYPE.IMAGE, image);
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
        console.log('파이프라인 중단 플래그 설정 (예약)');
        this.setStopPipelineFlag(true);
      }
      this._index++;
    }

    // output 내보내기
    return output;
  };
};

export default source;
