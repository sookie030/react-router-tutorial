const fs = require("fs");
const ref = require("ref-napi");
const ArrayType = require("ref-array-di")(ref);
const constants = require("./constants");
const datatypes = require("./datatypes");
const vision = require("./corewrap");

/**
 * vector file 읽기
 */
function readFile(fileName) {
  let data = fs.readFileSync(fileName, "utf8");
  data = data.split(",").map((item) => {
    return parseInt(item, 10);
  });
  return new Uint8Array(data);
}

/**
 * 0 element가 제외된 배열을 리턴
 */
function filterNotZero(array) {
  let filteredData = resultToArray.filter((elem) => {
    if (elem !== 255) {
      return elem;
    }
  });
  return filteredData;
}

// 파일 읽어서 vector array 가져오기
let data = readFile("./src/vision/text0.txt");
console.log("1. data.length: ", data.length);

// ImageInfo
let imageInfoStr = new datatypes.ImageInfo();
imageInfoStr.data = Buffer.from(data);
imageInfoStr.size = new datatypes.SizeInfo({
  width: 3,
  height: 1,
});
imageInfoStr.color = constants.COLOR_FORMAT.COLOR_RGB_888;
imageInfoStr.bytes_per_pixel = 3;
imageInfoStr.coordinate = constants.COORDINATE_TYPE.COORDINATE_LEFT_TOP;

// TODO: {ImageInfo *} image
let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

// TODO: {ImageInfo *} result
let result = ArrayType("uint8", data.length);
let resultPtr = ref.alloc(result);
console.log("2. resultPtr: ", resultPtr);

// let beforeResult = resultPtr.deref();
// console.log("3. hi beforeResult\n\t", beforeResult);

// TODO: Average Function!
vision.getAverageBlur(imageInfoPtr, resultPtr);

let afterResult = resultPtr.deref();
console.log("3. hello afterResult\n\t", afterResult);

let resultToArray = new Uint8Array(afterResult);

let filteredData = filterNotZero(resultToArray);
console.log("4. hello afterResult (filter) \n\t", filteredData);

// // TODO: {ImageInfo *} result
// let resultPtr = Buffer.from(new Uint8Array(data.length));
// console.log("2. resultPtr: " ,resultPtr);

// let bytes = data.length * Uint8Array.BYTES_PER_ELEMENT;
// let beforeResult = ref.reinterpret(resultPtr, bytes);
// console.log("3. hi beforeResult\n\t", beforeResult);

// // TODO: Average Function!
// vision.getAverageBlur(imageInfoPtr, resultPtr);

// let afterResult = ref.reinterpret(resultPtr, bytes);
// console.log("4. hello afterResult\n\t", afterResult);

// let gooAfterResult = new Uint8Array(resultPtr.reinterpret(bytes));
// console.log("5. hello gooAfterResult \n\t", gooAfterResult);
// console.log("6. hello gooAfterResult is array? ", Array.isArray(gooAfterResult));

// let filteredData = gooAfterResult.filter(elem => {
//     if (elem !== 255) {
//         return elem;
//     }
// })
// console.log("7. hello gooAfterResult (filter) \n\t", filteredData);
