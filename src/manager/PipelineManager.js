import { Map, List } from "immutable";

// import constants
import * as EVENT_TYPE from "../constants/EventType";
import * as MESSAGE from "../constants/Message";
import * as MESSAGE_TYPE from "../constants/MessageType";
import { SOURCE } from "../constants/module/Groups";
import * as GROUPS from "../constants/module/Groups"; 
import {
  CAMERA,
  FACE_CAMERA,
  FILE_LOADER,
  FILE_SAVER
} from "../constants/module/Modules";

// import module classes
import AIModules from "./modules/AI";
import DetectorModules from "./modules/Detector";
import FeatureModules from "./modules/Feature";
import FilterModules from "./modules/Filter";
import NotifierModules from "./modules/Notifier";
import SourceModules from "./modules/Source";
import DispatcherModules from "./modules/Dispatcher";

// import event
import events from "events";

class PipelineManager {
  constructor() {
    // node 정보
    this._nodeID = 0;
    this._nodes = List([]);

    // list 정보
    this._linkID = 0;
    this._links = List([]);

    // 실행할 모듈들이 담긴 파이프라인
    this._pipeline = [];

    // 모듈 실행으로 나온 결과값을 저장하는 object (key: 모듈의 id - value: 결과 데이터)
    this._dataList = Map({});

    // EventEmitter 객체 생성
    this.eventEmitter = new events.EventEmitter();

    // Pipeline 반복 실행 관련
    this.requestID = null;

    // Pipeline 작동 여부 플래그
    this.isPipelineRunning = false;

    // Pipeline 오류 발생 시, 재시작 시도 횟수
    this.tryingCount = 0;
  }

  /**
   * Return Node List
   */
  getNodes() {
    return this._nodes;
  }

  /**
   * Add node
   * @param {String} name
   * @param {String} group
   * @param {Object} position
   */
  addNode(name, group, position) {
    let newNode;
    switch (group) {
      case GROUPS.SOURCE:
        newNode = new SourceModules[name]();
        break;
      case GROUPS.FILTER:
        newNode = new FilterModules[name]();
        break;

      case GROUPS.DETECTOR:
        newNode = new DetectorModules[name]();
        break;

      case GROUPS.FEATURE:
        newNode = new FeatureModules[name]();
        break;

      case GROUPS.AI:
        newNode = new AIModules[name]();
        break;

      case GROUPS.NOTIFIER:
        newNode = new NotifierModules[name]();
        break;

      case GROUPS.DISPATCHER:
        newNode = new DispatcherModules[name]();
        break;

      default:
        newNode = null;
    }

    // Node 정보
    newNode.setID(this._nodeID++);
    newNode.setName(name);
    newNode.setGroup(group);
    newNode.setPosition(position);

    // Node 추가
    this._nodes = this._nodes.push(newNode);
  }

  /**
   * Remove node
   * @param {Number} nodeID
   */
  removeNode(nodeID) {
    this._nodes = this._nodes.filterNot(node => node.getID() === nodeID);
  }

  /**
   * Node의 속성값 변경
   * @param {Number} nodeID
   * @param {Immutable Map} newProperty
   */
  setPropertyOfNode(nodeID, newProperty) {
    const index = this._nodes.findIndex(node => node.getID() === nodeID);
    this._nodes.update(index, node => {
      node.setProperties(newProperty);

      if (node.getName() === CAMERA || node.getName() === FACE_CAMERA) {
        // Camera || Face Camera인 경우, Stream을 다시 가져온다.
        node.updateStream();
      }

      // else if (
      //   // File Loader || Saver인 경우, File list를 다시 가져온다.
      //   node.getName() === FILE_LOADER ||
      //   node.getName() === FILE_SAVER
      // ) {
      //   node.setList();
      // }

      return node;
    });
  }

  /**
   * 링크 리스트 리턴
   */
  getLinks() {
    return this._links;
  }

  /**
   * 링크 추가
   * @param {String} name
   * @param {String} group
   * @param {Object} position
   */
  addLink(from, to) {
    this._links = this._links.push(
      Map({
        id: this._linkID++,
        from: Map({
          node: from.nodeID,
          io: from.io,
          x: from.x,
          y: from.y,
          port: from.port
        }),
        to: Map({
          node: to.nodeID,
          io: to.io,
          x: to.x,
          y: to.y,
          port: to.port
        })
      })
    );
  }

  /**
   * 링크 삭제
   * @param {Number} linkID
   */
  removeLink(linkID) {
    this._links = this._links.filterNot(link => link.get("id") === linkID);
  }

  /**
   * 노드가 삭제될 때, 해당 노드와 연결된 링크 삭제
   * @param {Number} nodeID
   */
  removeLinksByRemovingNode(nodeID) {
    // 노드가 삭제되면 연결된 path가 동시에 삭제되어야 한다.
    var affectedlinkID = [];
    this._links.forEach(link => {
      if (
        link.getIn(["from", "node"]) === nodeID ||
        link.getIn(["to", "node"]) === nodeID
      ) {
        affectedlinkID.push(link.get("id"));
      }
    });

    // 삭제할 노드와 연결된 path를 동시에 삭제.
    this._links = this._links.filterNot(link =>
      affectedlinkID.includes(link.get("id"))
    );
  }

  /**
   * 노드가 드래그될 때, 해당 노드와 연결된 링크 위치 변경
   * @param {Number} linkID
   * @param {Immutable Map} newProperty
   */
  moveLinksByDraggingNode(nodeID, deltaX, deltaY) {
    // 드래그중인 노드와 연결되어있는 Path 찾기
    var affectedLinks = [];
    this._links.forEach((link, idx) => {
      if (link.getIn(["from", "node"]) === nodeID) {
        affectedLinks.push({
          id: idx,
          io: "from"
        });
      } else if (link.getIn(["to", "node"]) === nodeID) {
        affectedLinks.push({
          id: idx,
          io: "to"
        });
      }
    });

    // 연결된 Path들의 좌표값 변경해주기
    // var tmpLinks = state.get('links');
    affectedLinks.forEach(link => {
      this._links = this._links
        .setIn(
          [link.id, link.io, "x"],
          this._links.getIn([link.id, link.io, "x"]) + deltaX
        )
        .setIn(
          [link.id, link.io, "y"],
          this._links.getIn([link.id, link.io, "y"]) + deltaY
        );
    });

    // // 변경된 좌표 정보가 담긴 값을 state에 저장
    // return state.set('links', tmpLinks);
  }

  moveLinksByResizingNode(nodeID, deltaX, deltaY) {
    // 크기가 변경된 노드와 연결되어있는 Path 찾기
    let affectedLinks = [];
    this._links.forEach((link, idx) => {
      if (link.getIn(["from", "node"]) === nodeID) {
        affectedLinks.push({
          id: idx,
          io: "from",
          port: link.getIn(["from", "port"])
        });
      } else if (link.getIn(["to", "node"]) === nodeID) {
        affectedLinks.push({
          id: idx,
          io: "to",
          port: link.getIn(["to", "port"])
        });
      }
    });

    // 연결된 Path들의 좌표값 변경해주기
    // var tmpLinks = state.get('links');
    affectedLinks.forEach(link => {
      if (link.port === "top") {
        // do noting
      } else if (link.port === "left" || link.port === "right") {
        this._links = this._links
          .setIn(
            [link.id, link.io, "x"],
            this._links.getIn([link.id, link.io, "x"]) + deltaX / 2
          )
          .setIn(
            [link.id, link.io, "y"],
            this._links.getIn([link.id, link.io, "y"]) + deltaY / 2
          );
      } else if (link.port === "bottom") {
        this._links = this._links
          .setIn(
            [link.id, link.io, "x"],
            this._links.getIn([link.id, link.io, "x"]) + deltaX
          )
          .setIn(
            [link.id, link.io, "y"],
            this._links.getIn([link.id, link.io, "y"]) + deltaY
          );
      }
    });

    // 변경된 좌표 정보가 담긴 값을 state에 저장
    // return state.set('links', tmpLinks);
    // this._links = tmpLinks;
  }

  /**
   * Clear Linkboard
   */
  clearPipeline() {
    this._nodes = List([]);
    this._links = List([]);
  }

  // test end

  /**
   * 이벤트를 추가한다.
   * @param {String} eventName
   * @param {Function} handler
   */
  addListener(eventName, handler) {
    this.eventEmitter.on(eventName, handler);
  }

  /**
   * 이벤트를 제거한다.
   * @param {String} eventName
   * @param {Function} handler
   */
  removeListener(eventName, handler) {
    this.eventEmitter.off(eventName, handler);
  }

  /**
   * Pipeline이 변경될 때마다 다시 설정해준다.
   * @param {List<Object>} nodes
   * @param {List<Object>} links
   */
  setPipelineData(nodes, links) {
    this._nodes = nodes;
    this._links = links;
  }

  // 191211 test
  setLinks(links) {
    this._links = links;
  }

  /**
   * 다음에 이어지는 노드를 탐색하여 유효성 계속 확인
   */
  getNextNode = nodeID => {
    let isValid = true;

    // link가 있는지 확인.
    let linkList = this._links.filter(link => {
      if (link.getIn(["from", "node"]) === nodeID) {
        return link;
      } else {
        return null;
      }
    });

    // link가 없다는 것은 뒷 노드가 없다는 것.
    if (linkList === null || linkList.size === 0) {
      // console.log(`[PL Validation] [${nodeID}]${name} is the last node.`);
    } else {
      // link가 있다는 것은 뒷 노드가 있다는 것. 계속해서 노드를 찾는다.
      linkList.every(link => {
        var nextNode = this._nodes.find(
          node => node.getID() === link.getIn(["to", "node"])
        );

        if (!nextNode.getParentIds().includes(nodeID)) {
          nextNode.addParentId(nodeID);
        }

        // tmpPipeline에 추가
        this._tmpPipeline.push(nextNode);

        isValid = this.getNextNode(nextNode.getID());
        return isValid;
      });
    }
    return isValid;
  };

  setIsPipelineRunning(isPipelineRunning) {
    this.isPipelineRunning = isPipelineRunning;

    if (this.isPipelineRunning) {
      this.run();
    } else {
      this.stop();
    }
  }

  // Interval마다 검증/모듈생성/실행을 새로 반복한다.
  run() {
    console.log("run ", this.requestID);
    let isValid = this.validate();

    // 유효한 파이프라인인 경우에만 실행
    if (isValid) {
      // UI에서 설정한 Module List에 속하면, 결과값을 UI로 publish 해준다.
      this.eventEmitter.emit(EVENT_TYPE.SEND_PIPELINE_INFO, this._pipeline);

      this.execute();
      this.requestID = requestAnimationFrame(() => this.run());

      // // 첫 번째 source가 camera / face camera인지 확인
      // if (
      //   this._pipeline[0].getName() === CAMERA ||
      //   this._pipeline[0].getName() === FACE_CAMERA
      // ) {
      //   this.requestID = requestAnimationFrame(() => this.run());
      // }
    }
  }

  // pipeline 중단
  stop() {
    cancelAnimationFrame(this.requestID);

    // Source인 node들을 모두 찾는다.
    let sourceList = this._pipeline.filter(node => node.getGroup() === SOURCE);

    if (sourceList.length > 0) {
      sourceList.forEach(source => {
        if (source.getName() === CAMERA || source.getName() === FACE_CAMERA) {
          source.stopStream();
        }
      });
    }
  }

  trying() {
    this.stop();
    this.run();
    this.tryingCount++;
  }

  /**
   * pipeline이 유효한지 확인
   */
  validate() {
    let validPipelines = [];

    // Source인 node들을 모두 찾는다.
    let sourceList = this._nodes.filter(node => node.getGroup() === SOURCE);
    // console.log(sourceList.size, sourceList.length);
    // console.log(sourceList);

    if (sourceList.size < 1) {
      // Source Node 없음. Pipeline은 Source부터 시작해야 됨.
      this.eventEmitter.emit(
        EVENT_TYPE.POP_UP_TOAST,
        MESSAGE.NO_SOURCE,
        MESSAGE_TYPE.ERROR
      );
      return false;
    } else {
      // Source node들의 link를 하나씩 확인.
      sourceList.forEach(source => {
        // _tmpPipeline 정보: node id, prev node id (Source는 이전 노드가 오지 않으므로 -1), name
        this._tmpPipeline = [source];

        var isValidPipeline = this.getNextNode(source.getID());
        if (isValidPipeline === true) {
          validPipelines.push(this._tmpPipeline);
        }
      });

      if (validPipelines.length > 0) {
        this._pipeline = validPipelines.flat();
        // this.eventEmitter.emit('toast', MESSAGE.SUCCESS,  MESSAGE_TYPE.INFORMATION);
        return true;
      }
    }
  }

  /**
   * 파이프라인 실행 중 input이 여러개일 때, 다른 부모의 모듈로 건너뛰어 바로 실행할 수 있도록 인덱스를 리턴한다.
   */
  getAnotherParentId(module, currentInputCount) {
    var nextIndex = this._pipeline.findIndex(
      m => m.getID() === module.getParentIds()[currentInputCount]
    );
    return nextIndex;
  }

  /**
   * 파이프라인 실행
   */
  async execute() {
    console.log("execute");
    // 부모 모듈의 결과값 (즉, 현재 모듈에서 input으로 사용할 값)을 가져오기 위한 reduce 콜백함수
    var reducer = (accumulator, parentId) => {
      var input = this._dataList[parentId];
      if (input !== undefined) {
        accumulator.push(input);
      }
      return accumulator;
    };

    let tmpFlag = false;

    // 파이프라인을 실행한다. 각 노드 순차 실행.
    for (let i = 0; i < this._pipeline.length; ) {
      // module 가져오기
      var module = this._pipeline[i];

      if (module.getName() === FILE_LOADER) {
        console.log(module.getIndex(), module.getStopPipelineFlag());

        if (module.getStopPipelineFlag()) {
          console.log("pipeline stop (예약)");
          tmpFlag = true;
        }
      }

      // 부모 모듈의 output을 현재 모듈의 input으로 사용하기 위해 가져온다.
      var inputs = module.getParentIds().reduce(reducer, []);

      try {
        // Pipeline running flag === false임에도 execute 함수가 실행됨.
        // 이런 경우에는 그냥 loop를 빠져나온다.
        if (!this.isPipelineRunning) {
          console.log(
            "Pipeline running flag === false임에도 execute 함수가 실행"
          );
          break;
        }
        // module 실행
        var result = await module.process(inputs);

        // 에러 발생 시, 파이프라인을 중지한다.
        if (result instanceof Error) {
          // 파이프라인을 다시 시작해보자.
          this.eventEmitter.emit(
            EVENT_TYPE.POP_UP_TOAST,
            MESSAGE.TRY_TO_GET_SOURCE_AGAIN,
            MESSAGE_TYPE.WARNING
          );

          this.trying();

          break;
        } else if (result !== null && result !== undefined) {
          // module 실행 후 결과값을 저장한다.
          this._dataList[module.getID()] = result;

          // console.log(
          //   `[PL Execution] ${module.getName()} 실행 결과값을 저장합니다.`,
          // );

          // UI에서 설정한 Module List에 속하면, 결과값을 UI로 publish 해준다.
          this.eventEmitter.emit(
            EVENT_TYPE.SEND_PIPELINE_RESULT_TO_JSX,
            module
          );
          i++;
        } else {
          // 아직 input이 모두 들어오지 않은 상태.
          // 해당 모듈의 또 다른 부모를 찾아서 그 모듈부터 실행시킨다.
          // console.log(
          //   `[PL Execution] ${module.getName()} 실행 결과값이 없습니다.`,
          // );
          var nextIndex = this.getAnotherParentId(module, inputs.length);
          i = nextIndex > -1 ? nextIndex : i++;
        }
      } catch (e) {
        console.log("PipelineManager run error: ", e);
        break;
      }
    }
    this.eventEmitter.emit(EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER, tmpFlag);
  }
}

export default PipelineManager;
