/**
 * RGBA -> RGB (Alpha 제외)
 * @param {Array<number>} rgbaArray
 */
export function convertRGBAtoRGB(rgbaArray) {
  let rgbArray = [];
  // map 말고 forEach 사용한 이유: element === 0 이면 return 0이 되어 데이터가 유실됨
  rgbaArray.forEach((elem, index) => {
    if ((index + 1) % 4 > 0) {
      rgbArray.push(elem);
    }
  });

  return rgbArray;
}

/**
 * RGB -> RGBA (Alpha 추가)
 * @param {Array<number>} rgbArray
 */
export function convertRGBtoRGBA(rgbArray) {
  let rgbaArray = [];

  for (let i = 0; i < rgbArray.length; i += 3) {
    rgbaArray.push(rgbArray[i]);
    rgbaArray.push(rgbArray[i + 1]);
    rgbaArray.push(rgbArray[i + 2]);
    rgbaArray.push(255);
  }
  return rgbaArray;
}

/**
 * 버벅임이 더 적음.
 * @param {Array<number>} grayArray
 */
export function convertGray1toGray4ClampedArray(gray1Array) {
  let gray4ClampedArray = new Uint8ClampedArray(gray1Array.length * 4);

  for (let i = 0; i < gray1Array.length; i++) {
    // RGB에는 같은 값 (Grayscale)
    gray4ClampedArray[i * 4 + 0] = gray1Array[i];
    gray4ClampedArray[i * 4 + 1] = gray1Array[i];
    gray4ClampedArray[i * 4 + 2] = gray1Array[i];

    // Alpha는 항상 255
    gray4ClampedArray[i * 4 + 3] = 255;
  }

  return gray4ClampedArray;
}

/**
 * Gray (1 byte) -> Gray (4 bytes, RGBA)
 * @param {Array<number>} grayArray
 */
export function convertGray1toGray4(gray1Array) {
  let gray4Array = [];

  for (let i = 0; i < gray1Array.length; i++) {
    // RGB에는 같은 값 (Grayscale)
    for (let j = 0; j < 3; j++) {
      gray4Array.push(gray1Array[i]);
    }
    // Alpha는 항상 255
    gray4Array.push(255);
  }
  return gray4Array;
}

/**
 * Convert Gray array 4 bytes to 1 byte
 * @param {Array<number>} gray4Array
 */
export function convertGray4toGray1(gray4Array) {
  let gray1Array = [];
  for (let i = 0; i < gray4Array.length; i += 4) {
    gray1Array.push(gray4Array[i]);
  }
  return gray1Array;
}
