import { combineReducers } from "redux";
import { Map, List } from "immutable";

// import constants
import * as types from "./actionTypes";

/**
 * Node
 */
const nodesInitState = Map({
  selectedModule: null
});

const nodesManager = (state = nodesInitState, action) => {
  switch (action.type) {
    case types.SELECT_MODULE:
      return state.set("selectedModule", action.module);
    default:
      return state;
  }
};

/**
 * Link
 */
const linkInitState = Map({
  isLinking: false,

  // 드래그 중인 임시 end 좌표 Map({ x: 100, y: 100 }) 그려지는 중임을 보여주기 위해 사용
  linkingPosition: null
});

const linksManager = (state = linkInitState, action) => {
  switch (action.type) {
    case types.IS_LINKING:
      return state.set("isLinking", action.isLinking);

    case types.SET_LINKING_POSITION:
      return state.set(
        "linkingPosition",
        action.x === null && action.y === null
          ? null
          : Map({ x: action.x, y: action.y })
      );
    default:
      return state;
  }
};

/**
 * ContextMenu -tmp
 */
const ctxMenuInitState = Map({
  isShowing: false,

  // Map({ x: 100, y: 100 })
  position: null,

  // 20.02.07 contextmenu type test
  target: Map({})
});

const ctxMenuManager = (state = ctxMenuInitState, action) => {
  switch (action.type) {
    case types.IS_CTXMENU_SHOWING:
      return state.set("isShowing", action.isShowing);

    case types.SET_CTXMENU_POSITION:
      return state.set("position", Map({ x: action.x, y: action.y }));

    case types.SET_CTXMENU_TYPE:
      return state.set(
        "target",
        Map({ id: action.targetID, type: action.menuType })
      );

    default:
      return state;
  }
};

/**
 * ContextMenu
 */
const settingDialogInitState = Map({
  isShowing: false,
  selectedNodeID: null
});

const settingDialogManager = (state = settingDialogInitState, action) => {
  switch (action.type) {
    case types.IS_PROPS_SETTING_SHOWING:
      return state
        .set("isShowing", action.isShowing)
        .set("selectedNodeID", action.id);

    default:
      return state;
  }
};

/**
 * Toast
 */
const toastInitState = Map({
  // toast
  timeStamp: null,
  message: "",
  messageType: ""
});

const toastManager = (state = toastInitState, action) => {
  switch (action.type) {
    case types.SET_TOAST:
      return state
        .set("timeStamp", action.timeStamp)
        .set("message", action.message)
        .set("messageType", action.messageType);

    default:
      return state;
  }
};

/**
 * Pipeline
 */
const pipelineInitState = Map({
  pipelineManager: null,
  isRunning: false,
  dummyNumber: 0,

  isDragging: false
});

const pipelineManager = (state = pipelineInitState, action) => {
  switch (action.type) {
    case types.SET_PIPELINE_MANAGER:
      return state.set("pipelineManager", action.pipelineManager);

    case types.IS_PIPELINE_RUNNING:
      return state.set("isRunning", action.isRunning);

    case types.SET_DUMMY_NUMBER:
      return state.set("dummyNumber", state.get("dummyNumber") + 1);

    case types.IS_PIPELINE_DRAGGING:
      console.log(action.isDragging);
      return state.set("isDragging", action.isDragging);

    default:
      return state;
  }
};

/**
 * File Navigator
 */
const propertyNavigatorInitState = Map({
  isShowing: false,
  selectedNode: null
});

const propertyNavigatorManager = (
  state = propertyNavigatorInitState,
  action
) => {
  switch (action.type) {
    case types.IS_PROPERTY_NAVIGATOR_SHOWING:
      return state
        .set("isShowing", action.isShowing)
        .set("selectedNode", action.selectedNode);

    default:
      return state;
  }
};

/**
 * Router Navigator
 */
const routerInitState = Map({
  match: null
});

const routerManager = (state = routerInitState, action) => {
  switch (action.type) {
    case types.SET_CURRENT_MATCH:
      return state
        .set("match", action.match)

    default:
      return state;
  }
};

/**
 * Reducer 합치기
 */
const Reducer = combineReducers({
  nodesManager,
  linksManager,
  ctxMenuManager,
  settingDialogManager,
  toastManager,
  pipelineManager,
  propertyNavigatorManager
});
export default Reducer;
