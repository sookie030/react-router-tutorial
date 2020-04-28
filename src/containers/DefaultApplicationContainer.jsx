import React from "react";
import "../assets/styles/application.css";

// import images
import icModel from "../assets/images/ic_model.png";

import { plain2immutable } from "../utils/plain2immutable";
import * as PROP_TYPE from "../constants/PropertyType";

// redux modules
import { connect } from "react-redux";
import { setPropertiesOfNode } from "../redux/actions";

// router module
import { Link } from "react-router-dom";

// import constants
import { MODULES } from "../constants/ModuleInfo";
import * as EVENT_TYPE from "../constants/EventType";
import { MODIFY_LINK } from "../redux/actionTypes";

import TrainingContainer from "./DefaultApplicationTrainingContainer";
import RecognitionContainer from "./DefaultApplicationRecognitionContainer";
import ModelViewContainer from "./ModelContainer";
import ModelContainer from "./ModelContainer";

class DefaultApplicationContainer extends React.Component {
  // video source (camera, image files..)
  // roi
  // nm500
  // 모듈 유무 확인
  modulesInPipeline = { source: false, roi: false, nm500: false };

  // sourceCanvasRef = React.createRef();
  // roiCanvasRef = React.createRef();
  // previewCanvasRef = React.createRef();
  childViewRef = React.createRef();

  inputCanvas = {
    id: null,
    x: null,
    y: null,
    width: null,
    height: null
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
      color: "White"
    },

    // 화면에 그려지는 ROI 정보 (좌표값만 다름)
    roiOnCanvas: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: "White"
    },

    nm500: {
      context: {
        id: "-",
        name: "-"
      },
      category: {
        id: "-",
        name: "-"
      }
    },

    // training || recognition
    selectedIndex: 0,

    isModelViewShowing: false
  };

  componentDidMount() {
    console.log(this.props.match);
    console.log(this.childViewRef);
    // Pipeline에 이벤트 추가
    this.props.pipelineManager.addListener(
      EVENT_TYPE.SEND_PIPELINE_INFO,
      this.getPipelineInfo
    );

    this.props.pipelineManager.addListener(
      EVENT_TYPE.SEND_PIPELINE_RESULT_TO_VIEW,
      this.getResultFromPipelineManager
    );
  }

  componentDidUpdate() {
    // Model View 진입 -> 빠져나왔을 때, 기존 Training/Recognition에 지정했던 ref = null이 되어 오류나던 이슈 수정
    this.childViewRef =
      this.childViewRef === null ? React.createRef() : this.childViewRef;
  }

  componentWillUnmount() {
    // 이벤트, setTimeout, 외부 라이브러리 인스턴스 제거
    this.props.pipelineManager.removeListener(
      EVENT_TYPE.SEND_PIPELINE_INFO,
      this.getPipelineInfo
    );

    this.props.pipelineManager.removeListener(
      EVENT_TYPE.SEND_PIPELINE_RESULT_TO_VIEW,
      this.getResultFromPipelineManager
    );
  }

  /**
   * Pipeline에 추가할 이벤트 2
   */
  getPipelineInfo = pipeline => {
    console.log(pipeline);
    this.modulesInPipeline = { source: false, roi: false, nm500: false };
    pipeline.forEach(module => {
      switch (module.getName()) {
        case MODULES.CAMERA || MODULES.FACE_CAMERA || MODULES.FILE_LOADER:
          this.modulesInPipeline.source = true;
          break;
        case MODULES.ROI:
          this.modulesInPipeline.roi = true;
          break;
        case MODULES.NM500:
          this.modulesInPipeline.nm500 = true;
          break;
        default:
          break;
      }
    });
  };

  /**
   * Pipeline에 추가할 이벤트 2
   */
  getResultFromPipelineManager = module => {
    // Training 탭 선택한 경우에만 화면을 뿌려준다.
    // if (this.props.selectedIndex !== this.props.tabIndex) return;

    const inputCanvasCtx = this.childViewRef.sourceCanvasRef.getContext("2d");
    const roiCanvasCtx = this.childViewRef.roiCanvasRef.getContext("2d");

    switch (module.getName()) {
      case MODULES.CAMERA:
        // Camera Module의 결과값은 mediaStream. 얘를 video element에 넣어준다.
        let image = module
          .getOutput()
          .getModuleDataList()[0]
          .getData();

        // Camera Preview Size에 맞추어 Canvas Size 설정
        this.childViewRef.sourceCanvasRef.width = image.width;
        this.childViewRef.sourceCanvasRef.height = image.height;

        // Canvas에 캡쳐 이미지 뿌리기
        // inputCanvasCtx.drawImage(image, 0, 0);
        inputCanvasCtx.putImageData(image, 0, 0);

        // Canvas 실제 좌표값 및 사이즈 정보 갱신
        if (
          this.inputCanvas.id === null ||
          this.inputCanvas.id !== module.getID()
        ) {
          this.inputCanvas = {
            id: module.getID(),
            x: this.childViewRef.sourceCanvasRef.getBoundingClientRect().left,
            y: this.childViewRef.sourceCanvasRef.getBoundingClientRect().top,
            width: this.childViewRef.sourceCanvasRef.getBoundingClientRect()
              .width,
            height: this.childViewRef.sourceCanvasRef.getBoundingClientRect()
              .height
          };
        }

        // if (!this.modulesInPipeline.nm500) {
        //   this.drawPreviewImage(module);
        // }

        break;

      case MODULES.ROI:
        this.setState({
          hasROI: true
        });

        const x = Number(
          module.getProperties().getIn(["Area", "properties", "x", "value"])
        );
        const y = Number(
          module.getProperties().getIn(["Area", "properties", "y", "value"])
        );
        const width = Number(
          module.getProperties().getIn(["Area", "properties", "Width", "value"])
        );
        const height = Number(
          module
            .getProperties()
            .getIn(["Area", "properties", "Height", "value"])
        );
        const color = module.getProperties().getIn(["Color", "value"]);

        if (this.state.roi.id === module.getID()) {
          if (
            !this.state.mouseDownOnROI &&
            (this.state.roi.x !== x ||
              this.state.roi.y !== y ||
              this.state.roi.width !== width ||
              this.state.roi.height !== height ||
              this.state.roi.color !== color)
          ) {
            this.childViewRef.roiCanvasRef.width = this.childViewRef.sourceCanvasRef.width;
            this.childViewRef.roiCanvasRef.height = this.childViewRef.sourceCanvasRef.height;

            roiCanvasCtx.clearRect(
              0,
              0,
              this.childViewRef.roiCanvasRef.width,
              this.childViewRef.roiCanvasRef.height
            );
            roiCanvasCtx.beginPath();
            roiCanvasCtx.lineWidth = "3";
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
                color: color
              },

              roiOnCanvas: {
                x: x + this.inputCanvas.x,
                y: y + this.inputCanvas.y,
                width: width,
                height: height,
                color: color
              }
            });
          }
        } else {
          // Camera Preview Size에 맞추어 Canvas Size 설정
          this.childViewRef.roiCanvasRef.width = this.childViewRef.sourceCanvasRef.width;
          this.childViewRef.roiCanvasRef.height = this.childViewRef.sourceCanvasRef.height;

          roiCanvasCtx.clearRect(
            0,
            0,
            this.childViewRef.roiCanvasRef.width,
            this.childViewRef.roiCanvasRef.height
          );
          roiCanvasCtx.beginPath();
          roiCanvasCtx.lineWidth = "3";
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
              color: color
            },

            roiOnCanvas: {
              x: x + this.inputCanvas.x,
              y: y + this.inputCanvas.y,
              width: width,
              height: height,
              color: color
            }
          });
        }

        // ROI 테스트. ROI에 해당하는 영역만 잘라서 그려보자.
        this.drawPreviewImage(module);
        break;

      case MODULES.NM500:
        this.setState({
          nm500: {
            context: {
              id: module
                .getProperties()
                .getIn(["Context", "properties", "Context ID", "value"]),
              name: module
                .getProperties()
                .getIn(["Context", "properties", "Context Name", "value"])
            },
            category: {
              id: module
                .getProperties()
                .getIn(["Category", "properties", "Category ID", "value"]),
              name: module
                .getProperties()
                .getIn(["Category", "properties", "Category Name", "value"])
            }
          }
        });
        break;

      default:
        break;
    }
  };

  /**
   * Preview 영역에 이미지 뿌려주기
   */
  drawPreviewImage = module => {
    let previewImageData = module
      .getOutput()
      .getModuleDataList()[0]
      .getData();

    // imageData resize
    createImageBitmap(previewImageData, {
      resizeWidth: this.childViewRef.previewCanvasRef.width,
      resizeHeight: this.childViewRef.previewCanvasRef.height,
      resizeQuality: "high"
    }).then(image => {
      this.childViewRef.previewCanvasRef
      .getContext("2d").drawImage(image, 0, 0);
    });

    // Canvas에 캡쳐 이미지 뿌리기?
  };

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
        color: this.state.roiOnCanvas.color
      }
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
          case "nw-resize":
            newRoiOnCanvas.x = x;
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case "ne-resize":
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case "n-resize":
            newRoiOnCanvas.y = y;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height - e.movementY;
            break;
          case "sw-resize":
            newRoiOnCanvas.x = x;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case "se-resize":
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case "s-resize":
            newRoiOnCanvas.height = this.state.roiOnCanvas.height + e.movementY;
            break;
          case "w-resize":
            newRoiOnCanvas.x = x;
            // newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width - e.movementX;
            break;
          case "e-resize":
            // newRoiOnCanvas.x = x;
            // newRoiOnCanvas.y = y;
            newRoiOnCanvas.width = this.state.roiOnCanvas.width + e.movementX;
            break;
          case "move":
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
            color: newRoiOnCanvas.color
          }
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
            e.target.style.cursor = "nw-resize";
          } else if (
            roiOnCanvasX + roiWidth - spareSpace < x &&
            x < roiOnCanvasX + roiWidth + spareSpace
          ) {
            // 우측 상단 마우스 커서 변경
            e.target.style.cursor = "ne-resize";
          } else {
            // 우측 마우스 커서 변경
            e.target.style.cursor = "n-resize";
          }
        }

        // ROI: BOTTOM
        else if (
          roiOnCanvasY + roiHeight - spareSpace < y &&
          y < roiOnCanvasY + roiHeight + spareSpace
        ) {
          if (roiOnCanvasX - spareSpace < x && x < roiOnCanvasX + spareSpace) {
            // 좌측 하단 마우스 커서 변경
            e.target.style.cursor = "sw-resize";
          } else if (
            roiOnCanvasX + roiWidth - spareSpace < x &&
            x < roiOnCanvasX + roiWidth + spareSpace
          ) {
            // 우측 하단 마우스 커서 변경
            e.target.style.cursor = "se-resize";
          } else {
            // 하단 마우스 커서 변경
            e.target.style.cursor = "s-resize";
          }
        }

        // ROI: LEFT
        else if (
          roiOnCanvasX - spareSpace < x &&
          x < roiOnCanvasX + spareSpace
        ) {
          // 좌측 마우스 커서 변경
          e.target.style.cursor = "w-resize";
        }

        // ROI: RIGHT
        else if (
          roiOnCanvasX + roiWidth - spareSpace < x &&
          x < roiOnCanvasX + roiWidth + spareSpace
        ) {
          // 우측 마우스 커서 변경
          e.target.style.cursor = "e-resize";
        }

        // ROI Area
        else {
          // 내부 마우스 커서 변경
          e.target.style.cursor = "move";
        }
      }
    } else {
      // 기본으로 마우스 커서 변경
      e.target.style.cursor = "default";
    }
  };

  draw = () => {
    const roiCanvasCtx = this.childViewRef.roiCanvasRef.getContext("2d");
    roiCanvasCtx.clearRect(
      0,
      0,
      this.childViewRef.roiCanvasRef.width,
      this.childViewRef.roiCanvasRef.height
    );

    roiCanvasCtx.beginPath();
    roiCanvasCtx.lineWidth = "3";
    roiCanvasCtx.strokeStyle = this.state.roiOnCanvas.color;
    roiCanvasCtx.rect(
      this.state.roi.x,
      this.state.roi.y,
      this.state.roi.width,
      this.state.roi.height
    );
    roiCanvasCtx.stroke();
  };

  handleROIMouseUp = e => {
    // 변경된 ROI 정보를 Reducer에 저장
    if (this.state.mouseDownOnROI) {
      this.setState(
        {
          mouseDownOnCanvas: false,
          mouseDownOnROI: false
        },
        this.setROIProperty()
      );
    } else {
      this.setState({
        mouseDownOnCanvas: false
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
            value: Math.round(this.state.roi.x)
          },
          y: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.y)
          },
          Width: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.width)
          },
          Height: {
            type: PROP_TYPE.NUMBER_EDIT,
            value: Math.round(this.state.roi.height)
          }
        }
      },
      Color: {
        type: PROP_TYPE.DROPDOWN,
        options: [
          { key: 0, text: "White", value: "White" },
          { key: 1, text: "Red", value: "Red" },
          { key: 2, text: "Green", value: "Green" },
          { key: 3, text: "Blue", value: "Blue" }
        ],
        value: this.state.roi.color
      }
    };

    this.props.pipelineManager.setPropertyOfNode(
      this.state.roi.id,
      plain2immutable(properties)
    );
  };

  handleOnClickFooter = (index, e) => {
    this.setState({
      selectedIndex: index
    });
  };

  handleOnClickCloseBtn = () => {
    this.setState({
      isModelViewShowing: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="workspace bg-color-black">
          {this.state.isModelViewShowing ? (
            <ModelContainer
              handleOnClickCloseBtn={this.handleOnClickCloseBtn}
            />
          ) : this.state.selectedIndex === 0 ? (
            <TrainingContainer
              hasROI={this.state.hasROI}
              nm500={this.state.nm500}
              sourceCanvasRef={this.childViewRef.sourceCanvasRef}
              previewCanvasRef={this.childViewRef.previewCanvasRef}
              handleROIMouseDown={this.handleROIMouseDown}
              handleROIMouseMove={this.handleROIMouseMove}
              handleROIMouseUp={this.handleROIMouseUp}
              ref={r => (this.childViewRef = r)}
            />
          ) : (
            <RecognitionContainer
              hasROI={this.state.hasROI}
              nm500={this.state.nm500}
              sourceCanvasRef={this.childViewRef.sourceCanvasRef}
              previewCanvasRef={this.childViewRef.previewCanvasRef}
              handleROIMouseDown={this.handleROIMouseDown}
              handleROIMouseMove={this.handleROIMouseMove}
              handleROIMouseUp={this.handleROIMouseUp}
              ref={r => (this.childViewRef = r)}
            />
          )}

          <div
            className="model-view-btn"
            onClick={() =>
              this.setState({
                isModelViewShowing: true
              })
            }
          >
            <img src={icModel} alt="" width="30" height="30" />
          </div>

          {/** footer */}
          <div className="footer">
            <div
              className="footer-button"
              onClick={e => this.handleOnClickFooter(0, e)}
            >
              <div
                className={`footer-indicator${
                  this.state.selectedIndex === 0 ? ` selected` : null
                }`}
              />
              <p>Training (d)</p>
            </div>
            <div
              className="footer-button"
              onClick={e => this.handleOnClickFooter(1, e)}
            >
              <div
                className={`footer-indicator${
                  this.state.selectedIndex === 1 ? ` selected` : null
                }`}
              />
              <p>Recognition</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let mapStateToProps = state => {
  return {
    image: state.pipelineManager.get("image"),
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetPropertiesOfNode: (id, properties) =>
      dispatch(setPropertiesOfNode(id, properties))
  };
};

DefaultApplicationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultApplicationContainer);
export default DefaultApplicationContainer;
