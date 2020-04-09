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
function getBytesPerPixel(format) {
  return vision.getBytesPerPixel(format);
}

// 파일 읽어서 vector array 가져오기
let data = readFile("./src/vision/text_480_531_2.txt");
console.log("1. data.length: ", data.length);

console.log(getBytesPerPixel(constants.COLOR_FORMAT.COLOR_GRAY));
console.log(getBytesPerPixel(constants.COLOR_FORMAT.COLOR_RGB_565));
console.log(getBytesPerPixel(constants.COLOR_FORMAT.COLOR_RGB_888));

// Create ImageInfo (Struct)
let imageInfoStr = new datatypes.ImageInfo();
imageInfoStr.data = Buffer.from(data);
imageInfoStr.size = new datatypes.SizeInfo({
  width: 480,
  height: 531,
});
imageInfoStr.color = constants.COLOR_FORMAT.COLOR_RGB_888;
imageInfoStr.bytes_per_pixel = 3;
imageInfoStr.coordinate = constants.COORDINATE_TYPE.COORDINATE_LEFT_TOP;

resultImageInfo = imageInfoStr;

// Create ImageInfo (Pointer)
let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);
let resultImageInfoPtr = ref.alloc(datatypes.ImageInfo, resultImageInfo);

console.log("주소값 다른지 확인", imageInfoPtr, resultImageInfoPtr)

vision.getAverageBlur(imageInfoPtr, resultImageInfo.data);

console.log(resultImageInfo.data.length);

// TODO: Average Function!
// let result = vision.getAverageBlur_0409_2(
//   data,
//   480,
//   531,
//   constants.COLOR_FORMAT.COLOR_RGB_888,
//   3,
//   constants.COORDINATE_TYPE.COORDINATE_LEFT_TOP
// );


// // TODO: Average Function!
// let result = vision.getAverageBlur_0409(imageInfoStr);


