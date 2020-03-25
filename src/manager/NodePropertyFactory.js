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

// property rect 초기 좌표값
const INIT_PROP_X = 10;
const INIT_PROP_Y = 50;

// property rect 초기 높이값
const INIT_PROP_HEIGHT = 20;

// property rect 사이끼리 간격
const PROP_SPACE_X = 6;
const PROP_SPACE_Y = 6;

// Node 너비
const NODE_WIDTH = 200;

// font 한 글자 당 사이즈
const FONT_SIZE = 6;

// Property List
let splitPropertyList = [];

/**
 * 모듈 별로 Node에 보여줄 속성값을 받아온다.
 * 이후 해당 값을 그리기 위한 정보들을 얻어온다.
 * @param {Object} node
 */
const getPropertyComponent = node => {
  // 노드 정보
  const group = node.getGroup();
  const name = node.getName();

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
    return getPropertyUIInfo(property[group][name](node));
  }
};

/**
 * 보여줄 속성 값 리스트를 받고, 각 속성이 그려질 위치 및 크기 정보를 계산한다.
 * @param {List<String>} propertyList
 */
const getPropertyUIInfo = propertyList => {
  const reducer = (accumulator, currentValue, currentIndex) => {
    splitPropertyList = [];

    // 첫 번째 속성의 x, y 좌표는 초기값으로 고정
    if (currentIndex === 0) {
      // Multiline 여부 확인 & Multiline이면 속성 문자열 분할
      let tmpArray = currentValue.split(" ");
      do {
        tmpArray = splitProperty(tmpArray);
      } while (tmpArray.length > 0);

      console.log(splitPropertyList);
      accumulator.push({
        x: INIT_PROP_X,
        y: INIT_PROP_Y,
        width:
          // 속성이 한 줄 이상으로 표현될 예정
          splitPropertyList.length > 1
            ? NODE_WIDTH - INIT_PROP_X * 2
            : getWidth(currentValue),
        height: INIT_PROP_HEIGHT * splitPropertyList.length,
        value: splitPropertyList
      });

      // 두 번째 속성부터는 이전 속성의 좌표, 크기에 따라 좌표값을 계산한다.
    } else {
      // 프로퍼티 리스트가 Node Width보다 길어지면 다음 줄로 이동시킨다.
      if (
        accumulator[currentIndex - 1].x +
          accumulator[currentIndex - 1].width +
          PROP_SPACE_X +
          getWidth(currentValue) >
        NODE_WIDTH - PROP_SPACE_X
      ) {
        // 하나의 속성값을 보여줄 공간이 노드 크기보다 크면, 두 줄로 보여주어야 한다.
        if (needMultiLines(currentValue)) {
          // Multiline 여부 확인 & Multiline이면 속성 문자열 분할
          let tmpArray = currentValue.split(" ");
          if (tmpArray !== undefined && tmpArray.length > 0) {
            do {
              tmpArray = splitProperty(tmpArray);
            } while (tmpArray.length > 0);
          }

          accumulator.push({
            x: INIT_PROP_X,
            y:
              accumulator[currentIndex - 1].y +
              accumulator[currentIndex - 1].height +
              PROP_SPACE_Y,
            width:
              splitPropertyList.length > 1
                ? NODE_WIDTH - INIT_PROP_X * 2
                : getWidth(currentValue),
            height: INIT_PROP_HEIGHT * splitPropertyList.length,
            value: splitPropertyList
          });
        } else {
          accumulator.push({
            x: INIT_PROP_X,
            y:
              accumulator[currentIndex - 1].y +
              accumulator[currentIndex - 1].height +
              PROP_SPACE_Y,
            width: getWidth(currentValue),
            height: INIT_PROP_HEIGHT,
            value: [currentValue]
          });
        }

        // 아니면 옆에 바로 붙인다.
      } else {
        accumulator.push({
          x:
            accumulator[currentIndex - 1].x +
            accumulator[currentIndex - 1].width +
            PROP_SPACE_X,
          y: accumulator[currentIndex - 1].y,
          width: getWidth(currentValue),
          height: INIT_PROP_HEIGHT,
          value: [currentValue]
        });
      }
    }
    return accumulator;
  };

  return propertyList.reduce(reducer, []);
};

/**
 * 속성을 그릴 때의 너비 값을 계산한다.
 * @param {String} strProp
 */
const getWidth = strProp => {
  console.log('getWidth', strProp.length * FONT_SIZE + PROP_SPACE_X * 2);
  return strProp.length * FONT_SIZE + PROP_SPACE_X * 2;
};

/**
 * 속성을 그릴 때의 여러 줄을 사용해야 하는지 확인한다.
 * @param {String} strProp
 */
const needMultiLines = strProp => {
  return Math.ceil(getWidth(strProp) / (NODE_WIDTH - INIT_PROP_X * 2)) > 1;
};

/**
 * 하나의 속성이 너무 길어서 여러 줄을 사용하는 경우, 라인 별로 속성을 분리한다.
 */
const splitProperty = textArray => {
  for (let i = 0; i < textArray.length; i++) {
    // 가장 마지막 요소부터 제거하면서 한 줄로 표현할 수 있을 때까지 잘라본다.
    // [0, 1, 2, 3] -> [0, 1, 2] -> [0, 1]
    const splitList = i === 0 ? textArray.slice(0) : textArray.slice(0, -i);

    // 속성을 표현하는 데에 한 줄만 필요하다면 해당 속성을 저장한다.
    if (!needMultiLines(splitList.join(" "))) {
      splitPropertyList.push(splitList.join(" "));

      // 사용되지 않은 나머지 요소들을 배열로 리턴한다.
      return i === 0 ? [] : textArray.slice(-i);
    }
  }
};

export default getPropertyComponent;
