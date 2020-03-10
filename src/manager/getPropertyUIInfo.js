// property rect 초기 좌표값
const INIT_PROP_X = 10;
const INIT_PROP_Y = 50;

// property rect 사이끼리 간격
const PROP_SPACE_X = 6;
const PROP_SPACE_Y = 26;

// Node 크기
const NODE_WIDTH = 204;

const getWidth = strProp => {
  return strProp.length * 6 + 12;
};

const reducer = (accumulator, currentValue, currentIndex, array) => {
  if (currentIndex === 0) {
    accumulator.push({
      x: INIT_PROP_X,
      y: INIT_PROP_Y,
      width: getWidth(currentValue),
      value: currentValue,
    });
  } else {
    accumulator.push({
      x:
        accumulator[currentIndex - 1].x +
          accumulator[currentIndex - 1].width +
          PROP_SPACE_X +
          getWidth(currentValue) >
        NODE_WIDTH
          ? INIT_PROP_X
          : accumulator[currentIndex - 1].x +
            accumulator[currentIndex - 1].width +
            PROP_SPACE_X,
      y:
        accumulator[currentIndex - 1].x +
          accumulator[currentIndex - 1].width +
          PROP_SPACE_X +
          getWidth(currentValue) >
        NODE_WIDTH
          ? accumulator[currentIndex - 1].y + PROP_SPACE_Y
          : accumulator[currentIndex - 1].y,
      width: getWidth(currentValue),
      value: currentValue,
    });
  }
  return accumulator;
};

export default function getPropertyUIInfo(propertyList) {
  return propertyList.reduce(reducer, []);
}
