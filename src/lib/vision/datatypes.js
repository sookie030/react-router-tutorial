const constants = require("./constants");
const ffi = window.ffi;
const ref = window.ref;
const ArrayType = window.ArrayType;
const StructType = window.StructType;

/**************************************************
 * define.h - Struct
 **************************************************/

/**
 * Pixel info
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 */
exports.ColorInfo = StructType({
  red: "uint8",
  green: "uint8",
  blue: "uint8",
});

/**
 * Position info
 * @param {number} x
 * @param {number} y
 */
exports.PointInfo = StructType({
  x: "int32",
  y: "int32",
});

/**
 * Size info
 * @param {number} width
 * @param {number} height
 */
exports.SizeInfo = StructType({
  width: "int32",
  height: "int32",
});

/**
 * Rectangle info
 */
exports.RectInfo = StructType({
  point: this.PointInfo,
  size: this.SizeInfo,
});

/**
 * Vector info
 * @param {number} vector
 * @param {number} length
 */
exports.VectorInfo = StructType({
  vector: "uint8",
  length: "uint32",
});

/**
 * 32bit Vector info
 * @param {number} vector
 * @param {number} length
 */
exports.Vector32Info = StructType({
  vector: "uint32",
  length: "uint32",
});

/**
 * Image info
 * @param {uint8} data
 * @param {SizeInfo} size
 * @param {uint32} color
 * @param {uint8} bytes_per_pixel
 * @param {uint32} coordinate
 */
exports.ImageInfo = StructType({
  data: ref.refType('uint8'),
  size: this.SizeInfo,
  color: 'uint32',
  bytes_per_pixel: 'uint8',
  coordinate: 'uint32',
});

/**************************************************
 * utils/list.h
 **************************************************/

exports.ListNode = StructType({
  data: ref.refType("void"),

  // struct _list_node *previous;    // Previous node
  // struct _list_node *next;        // Next node
  // previous: ref.refType(this.ListNode),
  // next: ref.refType(this.ListNode)

  // 우선 void pointer로 지정해보쟈
  previous: ref.refType("void"),
  next: ref.refType("void"),
});

exports.ListInfo = StructType({
  head: ref.refType(this.ListNode),
  tail: ref.refType(this.ListNode),
  count: "uint32",
});

/**************************************************
 * edge/sobel.h
 **************************************************/
let calculateGradientFuncPtr = ffi.Function("uint16", [
  "int16",
  "int16",
  "bool",
]);

exports.SobelOptions = StructType({
  use_math: "bool",
  threshold_ratio: "int8",
  calculate_gradient: calculateGradientFuncPtr,
});

/**************************************************
 * edge/prewitt.h
 **************************************************/
exports.PrewittOptions = StructType({
  use_math: "bool",
  threshold_ratio: "int8",
  calculate_gradient: calculateGradientFuncPtr,
});

/**************************************************
 * edge/roberts.h
 **************************************************/
exports.RobertsOptions = StructType({
  use_math: "bool",
  threshold_ratio: "int8",
  calculate_gradient: calculateGradientFuncPtr,
});

/**************************************************
 * edge/canny.h
 **************************************************/
exports.CannyOptions = StructType({
  // High threshold ratio for edge as upper criteria (%)
  threshold_high_ratio: "int8",
  // Lower threshold ratio for edge as upper criteria (%)
  threshold_low_ratio: "int8",
});

/**************************************************
 * edge/hough.h
 **************************************************/
exports.HoughLineResult = StructType({
  start: this.PointInfo,
  end: this.PointInfo,
});

exports.HoughLineOptions = StructType({
  threshold: "uint16",
});

exports.HoughCircleResult = StructType({
  // Center point of result
  center: this.PointInfo,
  radius: "uint16",
});

exports.HoughCircleOptions = StructType({
  threshold: "uint16",
  min_radius: "uint16",
  max_radius: "uint16",
  redius_stride: "uint16",
});

/**************************************************
 * feature/hog.h
 **************************************************/
exports.HogOptions = StructType({
  // Binning count of histogram
  histogram_bin_num: "uint16",
  // Pixel count per cell
  pixel_per_cell: this.SizeInfo,
  // Cell count per block
  cell_per_block: this.SizeInfo,
  // Stride distance of block
  stride_distance: this.SizeInfo,
  // Whether to use magnitude info for calculate histogram index
  use_magnitude: "bool",
});

/**************************************************
 * detect/detect.h
 **************************************************/
exports.functionClassifyFuncPtr = ffi.Function("bool", [
  ref.refType(this.VectorInfo),
  ref.refType("uint32"),
]);

/**************************************************
 * detect/haar.h
 **************************************************/
exports.HaarOptions = StructType({
  // Minimum size of result's area
  min_size: this.SizeInfo,

  // Maximum size of result's area
  max_size: this.SizeInfo,

  // Increase rate of window size (%)
  scale_factor_ratio: "uint16",

  // Threshold ratio to pass the stage
  threshold_ratio: "uint8",

  // Minimum count of neighbor
  min_neighbors: "uint8",

  // Window size of the HAAR model
  window_size: this.SizeInfo,

  // Stage count of the HAAR model
  stage_count: "uint8",

  // Tree count of each stage
  tree_counts: ref.refType("uint8"),

  // Threshold of each stage
  stage_threshold: ref.refType("int16"),

  // Threshold of each tree
  tree_threshold: ref.refType("int16"),

  // Left value of each tree
  tree_left_value: ref.refType("int16"),

  // Right value of each tree
  tree_right_value: ref.refType("int16"),

  // Rectangle count of each tree
  tree_rect_count: ref.refType("int8"),

  // Relative coordinates of the rectangle of each tree
  tree_rects: ref.refType("int8"),

  // Weight of rectangle
  tree_rect_weights: ref.refType("int8"),
});