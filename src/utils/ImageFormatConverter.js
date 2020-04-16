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
 * Gray (1 byte) -> RGBA (4 bytes)
 * @param {Array<number>} grayArray
 */
export function convertGraytoRGBA(grayArray) {
  let rgbaArray = [];

  for (let i = 0; i < grayArray.length; i++) {
    // RGB에는 같은 값 (Grayscale)
    for (let j = 0; j < 3; j++) {
      rgbaArray.push(grayArray[i]);
    }
    // Alpha는 항상 255
    rgbaArray.push(255);
  }
  return rgbaArray;
}

/**
 * 버벅임이 더 적음.
 * @param {Array<number>} grayArray
 */
export function convertGraytoRGBAClampedArray(grayArray) {
  let rgbaArray = new Uint8ClampedArray(grayArray.length * 4);

  for (let i = 0; i < grayArray.length; i++) {
    // RGB에는 같은 값 (Grayscale)
    rgbaArray[i * 4 + 0] = grayArray[i];
    rgbaArray[i * 4 + 1] = grayArray[i];
    rgbaArray[i * 4 + 2] = grayArray[i];

    // Alpha는 항상 255
    rgbaArray[i * 4 + 3] = 255;
  }

  return rgbaArray;
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
