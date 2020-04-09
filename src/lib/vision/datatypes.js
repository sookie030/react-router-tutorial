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
 * @param {uint8} color
 * @param {uint8} bytes_per_pixel
 * @param {uint8} coordinate
 */
exports.ImageInfo = StructType({
  data: ref.refType(ref.types.uint8),
  // data: "uint8*",
  size: this.SizeInfo,
  color: "uint8",
  bytes_per_pixel: "uint8",
  coordinate: "uint8",
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

/**
 * Definition of data type for device connection
 */
exports.Device = StructType({
  dev: "void *",
  handle: "void *",
  lock: "void *",
  type: "uint16",
  id: "uint16",
  vid: "uint16",
  pid: "uint16",
  is_open: "uint8",
});

/**
 * Definition of data type for device network information
 * neuron_size: number of neurons
 * neuron_memory_size: memory size of each neuron.
 * version: version of device firmware
 */
exports.NetworkInfo = StructType({
  neuron_count: "uint32",
  neuron_memory_size: "uint16",
  version: "uint16",
});

/**
 * Definition of data type for network status
 * network_used: number of used/committed neurons
 * network_type: RBF or KNN
 * context: current/global context
 * norm: current norm type
 */
exports.NetworkStatus = StructType({
  network_used: "uint32",
  context: "uint16",
  network_type: "uint8",
  norm: "uint8",
});

/**
 * Definition of data type for context
 * context: context id
 * norm: norm type
 * minif: minimum influence field
 * maxif: maximum influence field
 */
exports.Context = StructType({
  context: "uint16",
  norm: "uint16",
  minif: "uint16",
  maxif: "uint16",
});

/**
 * Definition of data type for neuron
 * nid: neuron id
 * size: vector length used in neuron memory (vector size)
 * ncr: neuron context (context id, norm)
 * aif: active influence field (threshold of activation function)
 * minif: minimum influence field
 * model: prototype (stored weight memory)
 */
const Neuron = StructType({
  nid: "uint32",
  size: "uint16",
  ncr: "uint16",
  aif: "uint16",
  minif: "uint16",
  cat: "uint16",
  model: ArrayType("uint8", 256),
});
exports.Neuron = Neuron;

/**
 * Definition of data type for classifing request/response
 * <<input>>
 * @param {number} sizeinput data size
 * @param {!Array<uint8>} vector input data
 * @param {number} k number of returns matched
 *
 * <<output>>
 * @return status: network status of classifying
 * @return matched_count: number(n) of matched
 * @return nid[n]: id of neuron matched
 * @return category[n]: category of neuron matched
 * @return degenerated[n]: degenerated flag of neuron matched (1: degenerated)
 * @return distance[n]: distance between input data and prototype of neuron matched
 */
exports.ClassifyReq = StructType({
  status: "uint32",
  size: "uint16",
  k: "uint16",
  matched_count: "uint16",
  nid: ArrayType("uint32", constants.CLASSIFY_MAX_K),
  degenerated: ArrayType("uint16", constants.CLASSIFY_MAX_K),
  distance: ArrayType("uint16", constants.CLASSIFY_MAX_K),
  category: ArrayType("uint16", constants.CLASSIFY_MAX_K),
  vector: ArrayType("uint8", 256),
});

/**
 * Definition of data type for learning request/response
 * <<input>>
 * @param {number} query_affected flag for whether to retrieve affected neuron information
 *   generally flagging is not required.
 * @param {number} category category of input data(vector)
 * @param {number} size input data size
 * @param {!Array<number>} vector input data
 *
 * <<output>>
 * @return status: network status of learning
 * @return affected_count: number of affected neurons
 * @return affected_neurons[affected_count]: list of affected neurons
 */
exports.LearnReq = StructType({
  status: "uint32",
  affected_neurons: ArrayType(Neuron, 10),
  affected_count: "uint16",
  category: "uint16",
  size: "uint16",
  vector: ArrayType("uint8", 256),
  query_affected: "uint8",
});

/**
 * Definition of data type for batch learning request/response
 * <<input>>
 * @param {number} iterable flag for whether to iterate batch learning
 * @param {number} iter_count number of iteration (epoch)
 * @param {number} vector_count number of vectors
 * @param {number} vector_size input data size
 * @param {!Array<number>} vectors list of input data
 * @param {!Array<number>} categories list of category of input data(vector)
 *
 * <<output>>
 */
exports.LearnBatchReq = StructType({
  vector_count: "uint32",
  iter_result: ref.refType("uint32"),
  iter_count: "uint16",
  iterable: "uint16",
  vector_size: "uint16",
  categories: ref.refType("uint16"),
  vectors: ref.refType("uint8"),
});

/**
 * Definition of data type for clusterize request/response
 * <<input>>
 * @param {number} initial_category initial category id (it must be greater than 0)
 * @param {number} incrementof unit of increasement of category id
 * @param {number} vector_count number of vectors
 * @param {number} vector_size input data size
 * @param {!Array<uint8>} vectors list of input data
 *
 * <<output>>
 */
exports.ClusterizeReq = StructType({
  vector_count: "uint32",
  vector_size: "uint16",
  initial_category: "uint16",
  incrementof: "uint16",
  vectors: "uint8*",
});

/**
 * Definition of data type for knowledge(or trained) model
 * count: number of neurons used/committed
 * max_context: the largest context id (1~127)
 * max_category: the largest category id (1~32766)
 */
exports.ModelInfo = StructType({
  count: "uint32",
  max_context: "uint16",
  max_category: "uint16",
});

/**
 * Definition of data type for knowledge(or trained) model analysis
 * it shows distribution of neuron per category
 * <<input>>
 * @param {number} context target context id for analysis
 *
 * <<output>>
 * @return count: number of neurons used/committed in given context
 * @return histo_cat[the largest category id + 1]: number of neurons per cateogory
 * @return histo_deg[the largest category id + 1]: nember of degenerated neuron per category
 */
exports.ModelStat = StructType({
  context: "uint16",
  count: "uint32",
  histo_cat: ref.refType("uint16"),
  histo_deg: ref.refType("uint16"),
});
