import React from 'react';
import '../assets/styles/training.css';

import { plain2immutable } from '../utils/plain2immutable';
import * as PROP_TYPE from '../constants/PropertyType';

// redux modules
import { connect } from 'react-redux';
import { setPropertiesOfNode } from '../redux/actions';

// import constants
import * as MODULES from '../constants/module/Modules';
import * as EVENT_TYPE from '../constants/EventType';

class TrainingContainer extends React.Component {
  titleRef = React.createRef();
  buttonRef = React.createRef();
  videoRef = React.createRef();
  inputCanvasRef = React.createRef();
  roiCanvasRef = React.createRef();
  roiResultRef = React.createRef();

  testRef = React.createRef();
  testRef1 = React.createRef();

  inputCanvas = {
    id: null,
    x: null,
    y: null,
    width: null,
    height: null,
  };

  state = {
    options: [],
    selectedDeviceID: null,
    imageSrc: null,

    // roi drag test
    mouseDownOnCanvas: false,
    mouseDownOnROI: false,
    hasROI: false,

    // ROI 모듈에 저장된 순수 정보
    roi: {
      id: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: 'White',
    },

    // 화면에 그려지는 ROI 정보 (좌표값만 다름)
    roiOnCanvas: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: 'White',
    },
  };

  componentDidMount() {
    this.setPublishEvent();
  }

  /**
   * Pipeline에 추가할 이벤트
   */
  getResultFromPipelineManager = module => {
    // Training 탭 선택한 경우에만 화면을 뿌려준다.
    // if (this.props.selectedIndex !== this.props.tabIndex) return;

    const inputCanvasCtx = this.inputCanvasRef.getContext('2d');
    const roiCanvasCtx = this.roiCanvasRef.getContext('2d');

    switch (module.getName()) {
      case MODULES.CAMERA:
        // Camera Module의 결과값은 mediaStream. 얘를 video element에 넣어준다.
        let image = module
          .getOutput()
          .getModuleDataList()[0]
          .getRawData();

        // Camera Preview Size에 맞추어 Canvas Size 설정
        this.inputCanvasRef.width = image.width;
        this.inputCanvasRef.height = image.height;

        // Canvas에 캡쳐 이미지 뿌리기
        inputCanvasCtx.drawImage(image, 0, 0);

        // Canvas 실제 좌표값 및 사이즈 정보 갱신
        if (
          this.inputCanvas.id === null ||
          this.inputCanvas.id !== module.getID()
        ) {
          this.inputCanvas = {
            id: module.getID(),
            x: this.inputCanvasRef.getBoundingClientRect().left,
            y: this.inputCanvasRef.getBoundingClientRect().top,
            width: this.inputCanvasRef.getBoundingClientRect().width,
            height: this.inputCanvasRef.getBoundingClientRect().height,
          };
        }

        break;

      case MODULES.ROI:
        this.setState({
          hasROI: true,
        });

        const roiNode = this.props.pipelineManager
          .getNodes()
          .find(node => node.getID() === module.getID());
        const x = Number(
          roiNode.getProperties().getIn(['Area', 'properties', 'x', 'value']),
        );
        const y = Number(
          roiNode.getProperties().getIn(['Area', 'properties', 'y', 'value']),
        );
        const width = Number(
          roiNode
            .getProperties()
            .getIn(['Area', 'properties', 'Width', 'value']),
        );
        const height = Number(
          roiNode
            .getProperties()
            .getIn(['Area', 'properties', 'Height', 'value']),
        );
        const color = roiNode.getProperties().getIn(['Color', 'value']);

        if (this.state.roi.id === module.getID()) {
          if (
            !this.state.mouseDownOnROI &&
            (this.state.roi.x !== x ||
              this.state.roi.y !== y ||
              this.state.roi.width !== width ||
              this.state.roi.height !== height ||
              this.state.roi.color !== color)
          ) {
            this.roiCanvasRef.width = this.inputCanvasRef.width;
            this.roiCanvasRef.height = this.inputCanvasRef.height;

            roiCanvasCtx.clearRect(
              0,
              0,
              this.roiCanvasRef.width,
              this.roiCanvasRef.height,
            );
            roiCanvasCtx.beginPath();
            roiCanvasCtx.lineWidth = '6';
            roiCanvasCtx.strokeStyle = color;
            roiCanvasCtx.rect(x, y, width, height);
            roiCanvasCtx.stroke();

            this.setState({
              roi: {
                id: module.getID(),
                x: x,
                y: y,
                width: width,
                height: height,
                color: color,
              },

              roiOnCanvas: {
                x: x + this.inputCanvas.x,
                y: y + this.inputCanvas.y,
                width: width,
                height: height,
                color: color,
              },
            });
          }
        } else {
          // Camera Preview Size에 맞추어 Canvas Size 설정
          this.roiCanvasRef.width = this.inputCanvasRef.width;
          this.roiCanvasRef.height = this.inputCanvasRef.height;

          roiCanvasCtx.clearRect(
            0,
            0,
            this.roiCanvasRef.width,
            this.roiCanvasRef.height,
          );
          roiCanvasCtx.beginPath();
          roiCanvasCtx.lineWidth = '6';
          roiCanvasCtx.strokeStyle = color;
          roiCanvasCtx.rect(x, y, width, height);
          roiCanvasCtx.stroke();

          this.setState({
            hasROI: true,
            roi: {
              id: module.getID(),
              x: x,
              y: y,
              width: width,
              height: height,
              color: color,
            },

            roiOnCanvas: {
              x: x + this.inputCanvas.x,
              y: y + this.inputCanvas.y,
              width: width,
              height: height,
              color: color,
            },
          });
        }

        // ROI 테스트. ROI에 해당하는 영역만 잘라서 그려보자.
        let roiImage = module
          .getOutput()
          .getModuleDataList()[0]
          .getRawData();

        // ROI Image Size에 맞추어 Canvas Size 설정
        this.roiResultRef.width = roiImage.width;
        this.roiResultRef.height = roiImage.height;

        // Canvas에 캡쳐 이미지 뿌리기
        this.roiResultRef.getContext('2d').drawImage(roiImage, 0, 0);

        break;

      default:
        break;
    }
  };

  /**
   * Pipeline에 이벤트 추가
   */
  setPublishEvent() {
    this.props.pipelineManager.setEventHandler(
      EVENT_TYPE.SEND_PIPELINE_RESULT_TO_JSX,
      this.getResultFromPipelineManager,
    );
  }

  /**
   * ROI Events
   */
  handleROIMouseDown = e => {
    this.setState({
      mouseDownOnCanvas: true,
      roi: {
        ...this.state.roi,
        x: this.state.roiOnCanvas.x - this.inputCanvas.x,
        y: this.state.roiOnCanvas.y - this.inputCanvas.y,
        width: this.state.roiOnCanvas.width,
        height: this.state.roiOnCanvas.height,
        color: this.state.roiOnCanvas.color,
      },
    });
  };

  handleROIMouseMove = e => {
    const x = e.clientX;
    const y = e.clientY;
    const roiOnCanvasX = this.state.roiOnCanvas.x;
    const roiOnCanvasY = this.state.roiOnCanvas.y;
    const roiWidth = this.state.roiOnCanvas.width;
    const roiHeight = this.state.roiOnCanvas.height;
    let spareSpace = 10;

    if (this.state.mouseDownOnCanvas) {
      // 마우스 빠르게 움직일 때 ROI 영역을 벗어나서 변경이 일어나지 않는 것을 방지
      spareSpace = Math.max(this.inputCanvas.x, this.inputCanvas.y);
    }

    // ROI 영역에 마우스 커서가 들어왔는지 확인
    if (
      roiOnCanvasX - spareSpace < x &&
      x < roiOnCanvasX + roiWidth + spareSpace &&
      roiOnCanvasY - spareSpace < y &&
      y < roiOnCanvasY + roiHeight + spareSpace
    ) {
      if (this.state.mouseDownOnCanvas) {
        let newRoiOnCanvas = this.state.roiOnCanvas;

        switch (e.target.style.cursor) {
          case 'nw-resize':
            newRoiOnCanvas.x = x;
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case 'ne-resize':
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case 'n-resize':
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case 'sw-resize':
            newRoiOnCanvas.x = x;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case 'se-resize':
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case 's-resize':
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case 'w-resize':
            newRoiOnCanvas.x = x;
            // newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            break;
          case 'e-resize':
            // newRoiOnCanvas.x = x;
            // newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            break;
          case 'move':
            newRoiOnCanvas.x = newRoiOnCanvas.x + e.movementX;
            newRoiOnCanvas.y = newRoiOnCanvas.y + e.movementY;
            break;
          default:
            break;
        }

        this.setState({
          mouseDownOnROI: true,
          roiOnCanvas: newRoiOnCanvas,
          roi: {
            ...this.state.roi,
            x: newRoiOnCanvas.x - this.inputCanvas.x,
            y: newRoiOnCanvas.y - this.inputCanvas.y,
            width: newRoiOnCanvas.width,
            height: newRoiOnCanvas.height,
            color: newRoiOnCanvas.color,
          },
        });

        // Canvas에 ROI 업데이트
        this.draw();
      } else {
        // ROI 변경 도중에는 커서 모양을 바꾸지 않는다.
        // 커서가 바뀌면 바뀐 커서에 해당하는 행동으로 전환되기 때문이다.
        // ROI: TOP
        if (roiOnCanvasY - spareSpace < y && y < roiOnCanvasY + spareSpace) {
          if (roiOnCanvasX - spareSpace < x && x < roiOnCanvasX + spareSpace) {
            // 좌측 상단 마우스 커서 변경
            e.target.style.cursor = 'nw-resize';
          } else if (
            roiOnCanvasX + roiWidth - spareSpace < x &&
            x < roiOnCanvasX + roiWidth + spareSpace
          ) {
            // 우측 상단 마우스 커서 변경
            e.target.style.cursor = 'ne-resize';
          } else {
            // 우측 마우스 커서 변경
            e.target.style.cursor = 'n-resize';
          }
        }

        // ROI: BOTTOM
        else if (
          roiOnCanvasY + roiHeight - spareSpace < y &&
          y < roiOnCanvasY + roiHeight + spareSpace
        ) {
          if (roiOnCanvasX - spareSpace < x && x < roiOnCanvasX + spareSpace) {
            // 좌측 하단 마우스 커서 변경
            e.target.style.cursor = 'sw-resize';
          } else if (
            roiOnCanvasX + roiWidth - spareSpace < x &&
            x < roiOnCanvasX + roiWidth + spareSpace
          ) {
            // 우측 하단 마우스 커서 변경
            e.target.style.cursor = 'se-resize';
          } else {
            // 하단 마우스 커서 변경
            e.target.style.cursor = 's-resize';
          }
        }

        // ROI: LEFT
        else if (
          roiOnCanvasX - spareSpace < x &&
          x < roiOnCanvasX + spareSpace
        ) {
          // 좌측 마우스 커서 변경
          e.target.style.cursor = 'w-resize';
        }

        // ROI: RIGHT
        else if (
          roiOnCanvasX + roiWidth - spareSpace < x &&
          x < roiOnCanvasX + roiWidth + spareSpace
        ) {
          // 우측 마우스 커서 변경
          e.target.style.cursor = 'e-resize';
        }

        // ROI Area
        else {
          // 내부 마우스 커서 변경
          e.target.style.cursor = 'move';
        }
      }
    } else {
      // 기본으로 마우스 커서 변경
      e.target.style.cursor = 'default';
    }
  };

  draw = () => {
    const roiCanvasCtx = this.roiCanvasRef.getContext('2d');
    roiCanvasCtx.clearRect(
      0,
      0,
      this.roiCanvasRef.width,
      this.roiCanvasRef.height,
    );

    roiCanvasCtx.beginPath();
    roiCanvasCtx.lineWidth = '6';
    roiCanvasCtx.strokeStyle = this.state.roiOnCanvas.color;
    roiCanvasCtx.rect(
      this.state.roi.x,
      this.state.roi.y,
      this.state.roi.width,
      this.state.roi.height,
    );
    roiCanvasCtx.stroke();
  };

  handleROIMouseUp = e => {
    // 변경된 ROI 정보를 Reducer에 저장
    if (this.state.mouseDownOnROI) {
      this.setState(
        {
          mouseDownOnCanvas: false,
          mouseDownOnROI: false,
        },
        this.setROIProperty(),
      );
    } else {
      this.setState({
        mouseDownOnCanvas: false,
      });
    }
  };

  setROIProperty = () => {
    let properties = {
      Area: {
        type: PROP_TYPE.GROUP,
        properties: {
          x: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.x),
          },
          y: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.y),
          },
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.width),
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.height),
          },
        },
      },
      Color: {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: 'White', value: 'White' },
          { key: 1, text: 'Red', value: 'Red' },
          { key: 2, text: 'Green', value: 'Green' },
          { key: 3, text: 'Blue', value: 'Blue' },
        ],
        value: this.state.roi.color,
      },
    };

    this.props.pipelineManager.setPropertyOfNode(
      this.state.roi.id,
      plain2immutable(properties),
    );
  };

  render() {
    return (
      <div className="workspace bg-color-black">
        <p ref={r => (this.titleRef = r)}>TrainingContainer</p>
        <canvas ref={r => (this.inputCanvasRef = r)} />
        <canvas
          ref={r => (this.roiCanvasRef = r)}
          onMouseDown={this.state.hasROI ? this.handleROIMouseDown : null}
          onMouseMove={this.state.hasROI ? this.handleROIMouseMove : null}
          onMouseUp={this.state.hasROI ? this.handleROIMouseUp : null}
        />
        <canvas ref={r => (this.roiResultRef = r)} />
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    image: state.pipelineManager.get('image'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetPropertiesOfNode: (id, properties) =>
      dispatch(setPropertiesOfNode(id, properties)),
  };
};

TrainingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrainingContainer);
export default TrainingContainer;
