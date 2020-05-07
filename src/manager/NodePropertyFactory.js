import { GROUPS } from "../constants/ModuleInfo";

import SourceProperty from "../components/nodeProperty/SourceProperty";
import FilterProperty from "../components/nodeProperty/FilterProperty";
import DetectorProperty from "../components/nodeProperty/DetectorProperty";
import FeatureProperty from "../components/nodeProperty/FeatureProperty";
import AIProperty from "../components/nodeProperty/AIProperty";
import NotifierProperty from "../components/nodeProperty/NotifierProperty";
import DispatcherProperty from "../components/nodeProperty/DispatcherProperty";

let property = {};
property[GROUPS.SOURCE] = SourceProperty;
property[GROUPS.FILTER] = FilterProperty;
property[GROUPS.FEATURE] = FeatureProperty;
property[GROUPS.DETECTOR] = DetectorProperty;
property[GROUPS.AI] = AIProperty;
property[GROUPS.NOTIFIER] = NotifierProperty;
property[GROUPS.DISPATCHER] = DispatcherProperty;

/**
 * 모듈 별로 Node에 보여줄 속성값을 받아온다.
 * 이후 해당 값을 그리기 위한 정보들을 얻어온다.
 * @param {Object} node
 */
const getPropertyComponent = (node) => {
  var group = node.getGroup();
  var name = node.getName();

  // 예외처리 - 그룹명/모듈명이 없는 경우
  if (group === undefined || name === undefined) {
    return null;
  }

  // 예외처리2 - 유효하지 않은 그룹명
  if (property[group] === undefined) {
    return null;

    // 예외처리 3 - 속성값이 없는 모듈
  } else if (property[group][name] === undefined) {
    return [];

    // 유효한 속성값
  } else {
    // return getPropertyUIInfo(property[group][name](node));
    return property[group][name](node);
  }
};

export default getPropertyComponent;
