// Load modules about ffi
const ffi = window.ffi;
const ref = window.ref;
const ArrayType = window.ArrayType;

// Load data
const constants = require("./constants");
const datatypes = require("./datatypes");

// libvision = "./lib/vision/libVisionLibrary1839.dylib";

// Declare int type
const int16 = ref.types.int16;
const uint8 = ref.types.uint8;
const uint16 = ref.types.uint16;
const uint32 = ref.types.uint32;
const bool = ref.types.bool;
const float = ref.types.float;

// Declare int pointer type
const uint8Ptr = ref.refType(uint8);
const uint16Ptr = ref.refType(uint16);
const voidPtr = ref.refType(ref.types.void);

// Declare array type
const uint8Array = ArrayType(uint8);
const uint8ArrayPtr = ref.refType(uint8Array);

// Declare neuromem type
const vectorInfoPtr = ref.refType(datatypes.VectorInfo);
const vectorInfoPtrPtr = ref.refType(vectorInfoPtr);
const vector32InfoPtr = ref.refType(datatypes.Vector32Info);
const imageInfoPtr = ref.refType(datatypes.ImageInfo);
const colorInfoPtr = ref.refType(datatypes.ColorInfo);
const rectInfoPtr = ref.refType(datatypes.RectInfo);

const listNodePtr = ref.refType(datatypes.ListNode);
const listInfoPtr = ref.refType(datatypes.ListInfo);

const sobelOptionsPtr = ref.refType(datatypes.SobelOptions);
const prewittOptionsPtr = ref.refType(datatypes.PrewittOptions);
const robertsOptionsPtr = ref.refType(datatypes.RobertsOptions);
const cannyOptionsPtr = ref.refType(datatypes.CannyOptions);
const houghLineOptionsPtr = ref.refType(datatypes.HoughLineOptions);
const houghCircleOptionsPtr = ref.refType(datatypes.HoughCircleOptions);
const hogOptionsPtr = ref.refType(datatypes.HogOptions);
const haarOptionsPtr = ref.refType(datatypes.HaarOptions);

// 20.04.01 function pointer test (참조: https://groups.google.com/forum/#!topic/nodejs/rsgt2ha660M)
const functionCalculateMagnitudePrewittPtr = ffi.Function("void", [
  uint32,
  prewittOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr,
]);

const functionCalculateMagnitudeRobertPtr = ffi.Function("void", [
  uint32,
  robertsOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr,
]);

const functionCalculateMagnitudeSobelPtr = ffi.Function("void", [
  uint32,
  sobelOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr,
]);

const callbackFreeDataPtr = ffi.Function("void", [voidPtr]);

// Check OS
const platform = process.platform;

// Global variable for nmengine library
let libvision = null;

// Load appropriate library for the operating platform
if (platform === "Windows") {
  // libvision = './lib/nmengine.dll'
  // return devices
} else if (platform === "Linux") {
  // libvision = './lib/libnmengine.so'
} else {
  // libvision = "./lib/vision/libVisionLibrary1839.dylib";
  libvision = "./src/lib/vision/libVisionLibrary.dylib";
}

const visionlib = ffi.Library(libvision, {
  // 20.03.31 test on callback function
  // set_callback_function: ["void", ["pointer"]],

  /**********************************************************
   *  blur/average.h
   ***********************************************************/
  // void get_average_blur(imageInfoPtr, uint8_t *result_buffer);
  get_average_blur: ["void", [imageInfoPtr, uint8ArrayPtr]],

  // void get_average_blur_gray(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  // get_average_blur_gray: ["void", [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr]],
  get_average_blur_gray: ["void", [imageInfoPtr, uint8Ptr, uint8Ptr]],

  // void get_average_blur_gray2(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_average_blur_gray2: [
    "void",
    [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr],
  ],

  /**********************************************************
   * blur/bilateral.h
   ***********************************************************/
  // void get_bilateral_blur(imageInfoPtr, uint8_t *result_buffer);
  get_bilateral_blur: ["void", [imageInfoPtr, uint8ArrayPtr]],

  // void get_bilateral_blur_gray(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_bilateral_blur_gray: [
    "void",
    [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr],
  ],

  // void get_bilateral_blur_gray2(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_bilateral_blur_gray2: [
    "void",
    [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr],
  ],

  /**********************************************************
   *  blur/gaussian.h
   ***********************************************************/
  // void get_gaussian_blur(imageInfoPtr, image_info *result_image);
  get_gaussian_blur: ["void", [imageInfoPtr, imageInfoPtr]],

  /**********************************************************
   * blur/meidan.h
   ***********************************************************/
  // void get_median_blur(imageInfoPtr, uint8_t *result_buffer);
  get_median_blur: ["void", [imageInfoPtr, uint8ArrayPtr]],

  // void get_median_blur_gray(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_median_blur_gray: ["void", [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr]],

  // void get_median_blur_gray2(imageInfoPtr, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_median_blur_gray2: ["void", [imageInfoPtr, uint8ArrayPtr, uint8ArrayPtr]],

  /**********************************************************
   * detect/detect.h - typedef 있음
   **********************************************************/
  // BOOL detect_roi(imageInfoPtr, size_info min_roi, size_info stride_ratio, function_classify classify, rect_info *result_rect);
  detect_roi: [
    bool,
    [
      imageInfoPtr,
      datatypes.SizeInfo,
      datatypes.SizeInfo,
      datatypes.functionClassifyFuncPtr,
      rectInfoPtr,
    ],
  ],

  /**********************************************************
   * detect/haar.h - typedef 있음
   **********************************************************/
  // void get_haar_cascade_detect(imageInfoPtr, rect_info sub_area, haar_options *options, list_info *result_rect_list);
  get_haar_cascade_detect: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, haarOptionsPtr, listInfoPtr],
  ],

  // void draw_haar_result(imageInfoPtr, list_info *result_rect_list);
  draw_haar_result: ["void", [imageInfoPtr, listInfoPtr]],

  /**********************************************************
   * detect/track.h - typedef 있음
   **********************************************************/
  // BOOL track_roi(imageInfoPtr, rect_info tracking_area, size_info min_roi, size_info stride_ratio, function_classify classify, rect_info *result_roi);
  // 20.03.27 - function_classify가 이렇게하는게 맞남
  track_roi: [
    bool,
    [
      imageInfoPtr,
      datatypes.RectInfo,
      datatypes.SizeInfo,
      datatypes.SizeInfo,
      datatypes.functionClassifyFuncPtr,
      datatypes.RectInfo,
    ],
  ],

  /**********************************************************
   * edge/canny.h - typedef 있음
   **********************************************************/
  // void get_canny_edge(size_info image_size, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector, canny_options *options, image_info *result_image);
  get_canny_edge: [
    "void",
    [datatypes.SizeInfo, uint16Ptr, uint16Ptr, cannyOptionsPtr, imageInfoPtr],
  ],

  // uint16_t calculate_canny_gradient(int16_t vertical_magnitude, int16_t horizontal_magnitude, BOOL use_math);
  calculate_canny_gradient: [uint16, [int16, int16, bool]],

  /**********************************************************
   * edge/hough.h - typedef 있음
   **********************************************************/
  // void get_hough_edge_line(imageInfoPtr, hough_line_options *options, list_info *edge_list);
  get_hough_edge_line: [
    "void",
    [imageInfoPtr, houghLineOptionsPtr, listInfoPtr],
  ],

  // void get_hough_edge_circle(imageInfoPtr, hough_circle_options *options, list_info *edge_list);
  get_hough_edge_circle: [
    "void",
    [imageInfoPtr, houghCircleOptionsPtr, listInfoPtr],
  ],

  // void draw_hough_line_result(list_info *result_list, imageInfoPtr);
  draw_hough_line_result: ["void", [imageInfoPtr, imageInfoPtr]],

  // void draw_hough_circle_result(list_info *result_list, imageInfoPtr);
  draw_hough_circle_result: ["void", [imageInfoPtr, imageInfoPtr]],

  /**********************************************************
   * edge/prewitt.h - typedef 있음
   **********************************************************/
  // void get_prewitt_edge(imageInfoPtr, prewitt_options *options, uint8_t *edge_magnitude_vector);
  get_prewitt_edge: ["void", [imageInfoPtr, prewittOptionsPtr, uint8Ptr]],

  // void get_prewitt_edge_with_gradient(imageInfoPtr, prewitt_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_prewitt_edge_with_gradient: [
    "void",
    [imageInfoPtr, prewittOptionsPtr, uint16Ptr, uint16Ptr],
  ],

  /**********************************************************
   * edge/roberts.h - typedef 있음
   **********************************************************/
  // void get_roberts_edge(imageInfoPtr, roberts_options *options, uint8_t *edge_magnitude_vector);
  get_roberts_edge: ["void", [imageInfoPtr, robertsOptionsPtr, uint8Ptr]],

  // void get_roberts_edge_with_gradient(imageInfoPtr, roberts_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_roberts_edge_with_gradient: [
    "void",
    [imageInfoPtr, robertsOptionsPtr, uint16Ptr, uint16Ptr],
  ],

  /**********************************************************
   * edge/sobel.h - typedef 있음
   **********************************************************/
  // void get_sobel_edge(imageInfoPtr, sobel_options *options, uint8_t *edge_magnitude_vector);
  get_sobel_edge: ["void", [imageInfoPtr, sobelOptionsPtr, uint8Ptr]],

  // void get_sobel_edge_with_gradient(imageInfoPtr, sobel_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_sobel_edge_with_gradient: [
    "void",
    [imageInfoPtr, sobelOptionsPtr, uint16Ptr, uint16Ptr],
  ],

  /**********************************************************
   * feature/edgegap.h - define 있음
   **********************************************************/
  // void get_edge_gap_feature(imageInfoPtr, size_info line_num, uint8_t *edge_gap_feature);
  get_edge_gap_feature: ["void", [imageInfoPtr, datatypes.SizeInfo, uint8Ptr]],

  /**********************************************************
   * feature/hog.h - typedef 있음 / - define 있음
   **********************************************************/
  // void get_hog_feature(size_info image_size, uint16_t *edge_magnitude, uint16_t *edge_gradient, hog_options *options, vector_info **hog_feature);
  get_hog_feature: [
    "void",
    [datatypes.SizeInfo, uint16Ptr, uint16Ptr, hogOptionsPtr, vectorInfoPtrPtr],
  ],

  // uint16_t calculate_hog_gradient(int16_t vertical_magnitude, int16_t horizontal_magnitude, BOOL use_math);
  calculate_hog_gradient: [uint16, [int16, int16, bool]],

  /**********************************************************
   * feature/lbp.h
   **********************************************************/
  // void get_uniform_lbp_feature(imageInfoPtr, vector_info **uniform_lbp_feature);
  get_uniform_lbp_feature: ["void", [imageInfoPtr, vectorInfoPtrPtr]],

  /**********************************************************
   * feature/subsample.h - define 있음
   **********************************************************/
  // void get_subsample_feature(imageInfoPtr, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_feature: ["void", [imageInfoPtr, datatypes.SizeInfo, uint8Ptr]],

  // void get_subsample_feature2(imageInfoPtr, rect_info sub_area, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_feature2: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8Ptr],
  ],

  // void get_subsample_color_feature(imageInfoPtr, rect_info sub_area, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_color_feature: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8Ptr],
  ],

  /**********************************************************
   * utils/bytesperpixel.h
   **********************************************************/
  // uint8_t get_bytes_per_pixel(color_format format),
  get_bytes_per_pixel: [uint8, [uint8]],

  /**********************************************************
   * utils/crop.h
   **********************************************************/
  // image_info* crop_image(imageInfoPtr, rect_info area);
  crop_image: [imageInfoPtr, [imageInfoPtr, datatypes.RectInfo]],

  // void crop_image_raw(imageInfoPtr, rect_info area, uint8_t *cropped_image);
  crop_image_raw: ["void", [imageInfoPtr, datatypes.RectInfo, uint8Ptr]],

  /**********************************************************
   * utils/equalize.h
   **********************************************************/
  // void equalize_gray_histogram(image_info *source, image_info *destination);
  equalize_gray_histogram: ["void", [imageInfoPtr, imageInfoPtr]],

  /**********************************************************
   * utils/grayscale.h
   **********************************************************/
  // image_info* get_grayscale_image(imageInfoPtr);
  get_grayscale_image: [imageInfoPtr, [imageInfoPtr]],

  // void get_grayscale_image_raw(imageInfoPtr, uint8_t *gray_image);
  get_grayscale_image_raw: ["void", [imageInfoPtr, uint8Ptr]],

  // image_info* get_grayscale_image2(imageInfoPtr, rect_info area);
  get_grayscale_image2: [imageInfoPtr, [imageInfoPtr, datatypes.RectInfo]],

  // void get_grayscale_image_raw2(imageInfoPtr, rect_info area, uint8_t *gray_image);
  get_grayscale_image_raw2: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, uint8Ptr],
  ],

  /**********************************************************
   * utils/image.h
   **********************************************************/
  // image_info* create_image(size_info size, color_format format);
  create_image: [imageInfoPtr, [datatypes.SizeInfo, uint8]],

  // image_info* create_image_with_coordinate(size_info size, color_format format, coordinate_type coordinate);
  create_image_with_coordinate: [
    imageInfoPtr,
    [datatypes.SizeInfo, uint8, uint8],
  ],

  // image_info* create_image_from_image(imageInfoPtr);
  create_image_from_image: [imageInfoPtr, [imageInfoPtr]],

  // void destroy_image(imageInfoPtr);
  destroy_image: ["void", [imageInfoPtr]],

  // void free_image(imageInfoPtr);
  free_image: ["void", [imageInfoPtr]],

  // void function_image_free_list_data(void *image);
  function_image_free_list_data: ["void", [voidPtr]],

  /**********************************************************
   * utils/list.h - typedef 있음
   **********************************************************/
  // typedef void (*callback_free_data)(void *node); ???

  // list_info* create_list();
  create_list: [listInfoPtr, []],

  // void clear_list(list_info *list, callback_free_data free_data);
  clear_list: ["void", [listInfoPtr, callbackFreeDataPtr]],

  // void destroy_list(list_info *list, callback_free_data free_data);
  destroy_list: ["void", [listInfoPtr, callbackFreeDataPtr]],

  // list_node* get_node_from_list_at(list_info *list, uint32_t index);
  get_node_from_list_at: [listNodePtr, [listInfoPtr, uint32]],

  // void* get_data_from_list_head(list_info *list);
  get_data_from_list_head: ["void *", [listInfoPtr]],

  // void* get_data_from_list_tail(list_info *list);
  get_data_from_list_tail: ["void *", [listInfoPtr]],

  //void* get_data_from_list_at(list_info *list, uint32_t index);
  get_data_from_list_at: ["void *", [listInfoPtr, uint32]],

  //void push_data_to_list_head(list_info *list, void *data);
  push_data_to_list_head: ["void", [listInfoPtr, "void *"]],

  // void push_data_to_list_tail(list_info *list, void *data);
  push_data_to_list_tail: ["void", [listInfoPtr, "void *"]],

  // void push_data_to_list_at(list_info *list, uint32_t index, void *data);
  push_data_to_list_at: ["void", [listInfoPtr, uint32, "void *"]],

  // void* pop_data_from_list_head(list_info *list);
  pop_data_from_list_head: ["void *", [listInfoPtr]],

  // void* pop_data_from_list_tail(list_info *list);
  pop_data_from_list_tail: ["void *", [listInfoPtr]],

  // void* pop_data_from_list_at(list_info *list, uint32_t index);
  pop_data_from_list_at: ["void *", [listInfoPtr, uint32]],

  // void remove_from_list_head(list_info *list, callback_free_data free_data);
  remove_from_list_head: ["void", [listInfoPtr, callbackFreeDataPtr]],

  // void remove_from_list_tail(list_info *list, callback_free_data free_data);
  remove_from_list_tail: ["void", [listInfoPtr, callbackFreeDataPtr]],

  // void remove_from_list_at(list_info *list, uint32_t index, callback_free_data free_data);
  remove_from_list_at: ["void", [listInfoPtr, uint32, callbackFreeDataPtr]],

  /**********************************************************
   * utils/pixelaverage.h
   **********************************************************/
  // void get_pixel_average_color(imageInfoPtr, rect_info area, color_info *pixel);
  get_pixel_average_color: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, colorInfoPtr],
  ],

  // void get_pixel_average_gray(imageInfoPtr, rect_info area, uint8_t *pixel);
  get_pixel_average_gray: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, uint8Ptr],
  ],

  /**********************************************************
   * utils/pixelcolor.h
   **********************************************************/
  // void get_pixel_color(uint8_t *pixel_position, color_format format, color_info *pixel_color)
  get_pixel_color: ["void", [uint8Ptr, uint8, colorInfoPtr]],
  // void set_pixel_color(uint8_t *pixel_position, color_format format, color_info *pixel_color)
  set_pixel_color: ["void", [uint8Ptr, uint8, colorInfoPtr]],

  /***********************************************************
   *  utils/resize.h
   ***********************************************************/
  // image_info* resize_image(image_info *image, size_info target_size);
  resize_image: [imageInfoPtr, [imageInfoPtr, datatypes.SizeInfo]],

  // image_info* resize_to_grayscale_image(image_info *image, size_info target_size, resize_type type);
  resize_to_grayscale_image: [
    imageInfoPtr,
    [imageInfoPtr, datatypes.SizeInfo, uint8],
  ],

  // void resize_to_grayscale_image_raw(image_info *image, size_info target_size, resize_type type, uint8_t *resized_image);
  resize_to_grayscale_image_raw: [
    "void",
    [imageInfoPtr, datatypes.SizeInfo, uint8, uint8Ptr],
  ],

  // image_info* resize_to_grayscale_image2(image_info *image, rect_info sub_area, size_info target_size, resize_type type);
  resize_to_grayscale_image2: [
    imageInfoPtr,
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8],
  ],

  // void resize_to_grayscale_image_raw2(image_info *image, rect_info sub_area, size_info target_size, resize_type type, uint8_t *resized_image);
  resize_to_grayscale_image_raw2: [
    "void",
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8, uint8Ptr],
  ],

  /***********************************************************
   *  utils/squareroot.h
   ***********************************************************/
  // float get_square_root(float value);
  get_square_root: [float, [float]],

  /**********************************************************
   * utils/targetarea.h
   **********************************************************/
  // rect_info get_target_area(imageInfoPtr, rect_info criterion_area, size_info target_area_ratio);
  get_target_area: [
    datatypes.RectInfo,
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo],
  ],

  /**********************************************************
   * utils/vector.h
   **********************************************************/
  // vector_info* create_vector(uint32_t length);
  create_vector: [vectorInfoPtr, [uint32]],

  // void destroy_vector(vector_info *target);
  destroy_vector: ["void", [vectorInfoPtr]],

  // void free_vector(vector_info *target);
  free_vector: ["void", [vectorInfoPtr]],

  // void function_vector_free_list_data(void *target);
  function_vector_free_list_data: ["void", [voidPtr]],

  // vector32_info* create_vector32(uint32_t length);
  create_vector32: [vector32InfoPtr, [uint32]],

  // void destroy_vector32(vector32_info *target);
  destroy_vector32: ["void", [vector32InfoPtr]],

  // void free_vector32(vector32_info *target);
  free_vector32: ["void", [vector32InfoPtr]],

  // void function_vector32_free_list_data(void *target);
  function_vector32_free_list_data: ["void", [voidPtr]],
});

/**********************************************************
 *  blur/average.h
 ***********************************************************/
/**
 * Get the image with average blurred
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getAverageBlur = (imageInfoPtr, resultBufferPtr) => {
  visionlib.get_average_blur(imageInfoPtr, resultBufferPtr);
};

/**
 * Get the image with average blurred
 * @param {ImageInfo} imageInfoPtr Image info
 * @return {Array<number>} resultBufferPtr (output) Blurred image
 */
exports.getAverageBlur_0409 = (imageStr) => {
  // calculate data array size
  let size =
    imageStr.size.width * imageStr.size.height * imageStr.bytes_per_pixel;

  // create array pointer
  let resultPtr = Buffer.from(new Uint8Array(size).buffer);

  // TODO: call vision library
  visionlib.get_average_blur(imageStr.ref(), resultPtr);

  // get values from Buffer (result)
  let bytes = size * Uint8Array.BYTES_PER_ELEMENT;
  let result = new Uint8Array(resultPtr.reinterpret(bytes));

  return result;
};

/**
 * Get the image with average blurred after grayscale converting
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for grayscale converting
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getAverageBlurGray = (imageInfoPtr, tempBufferPtr, resultBufferPtr) => {
  visionlib.get_average_blur_gray(imageInfoPtr, tempBufferPtr, resultBufferPtr);
};

exports.getAverageBlurGray_0410 = (imageStr) => {
  // calculate data array size
  let tmpSize =
    imageStr.size.width * imageStr.size.height * imageStr.bytes_per_pixel;
  let resultSize = imageStr.size.width * imageStr.size.height;

  console.log(tmpSize, resultSize);

  // create array pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageStr);
  let tempBufferPtr = Buffer.from(new Uint8Array(tmpSize).buffer);
  let resultBufferPtr = Buffer.from(new Uint8Array(resultSize).buffer);

  visionlib.get_average_blur_gray(imageInfoPtr, tempBufferPtr, resultBufferPtr);

  // get values from Buffer (result)
  let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
  let result = new Uint8Array(resultBufferPtr.reinterpret(bytes));

  console.log(result);
};

/**
 * Get the image with grayscale converted after average blurring
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for average converting
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getAverageBlurGray2 = (
  imageInfoPtr,
  tempBufferPtr,
  resultBufferPtr
) => {
  visionlib.get_average_blur_gray2(
    imageInfoPtr,
    tempBufferPtr,
    resultBufferPtr
  );
};

/**********************************************************
 * blur/bilateral.h
 **********************************************************/
/**
 * Get the image with bilateral blurred
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getBilateralBlur = (imageInfoPtr, resultBufferPtr) => {
  visionlib.get_bilateral_blur(imageInfoPtr, resultBufferPtr);
};

/**
 * Get the image with bilateral blurred after grayscale converting
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for grayscale converting
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getBilateralBlurGray = (
  imageInfoPtr,
  tempBufferPtr,
  resultBufferPtr
) => {
  visionlib.get_bilateral_blur_gray(
    imageInfoPtr,
    tempBufferPtr,
    resultBufferPtr
  );
};

/**
 * Get the image with grayscale converted after bilateral blurring
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for bilateral blurring
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getBilateralBlurGray2 = (
  imageInfoPtr,
  tempBufferPtr,
  resultBufferPtr
) => {
  visionlib.get_bilateral_blur_gray2(
    imageInfoPtr,
    tempBufferPtr,
    resultBufferPtr
  );
};

/**********************************************************
 *  blur/gaussian.h
 **********************************************************/
/**
 * gaussian blur
 * @param {ImageInfo*} imageInfoPtr source image_info
 * @param {ImageInfo*} resultImagePtr destination image_info
 */
exports.getGaussianBlur = (imageInfoPtr, resultImagePtr) => {
  visionlib.get_gaussian_blur(imageInfoPtr, resultImagePtr);
};

/**********************************************************
 * blur/meidan.h
 **********************************************************/
/**
 * Get the image with median blurred
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getMedianBlur = (imageInfoPtr, resultBufferPtr) => {
  visionlib.get_median_blur(imageInfoPtr, resultBufferPtr);
};

/**
 * Get the image with median blurred after grayscale converting
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for grayscale converting
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getMedianBlurGray = (imageInfoPtr, tempBufferPtr, resultBufferPtr) => {
  visionlib.get_median_blur_gray(imageInfoPtr, tempBufferPtr, resultBufferPtr);
};

/**
 * Get the image with grayscale converted after median blurring
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} tempBufferPtr Temporary buffer for median blurring
 * @param {uint8*} resultBufferPtr (output) Blurred image
 */
exports.getMedianBlurGray2 = (imageInfoPtr, tempBufferPtr, resultBufferPtr) => {
  visionlib.get_median_blur_gray2(imageInfoPtr, tempBufferPtr, resultBufferPtr);
};

/**********************************************************
 * detect/detect.h
 **********************************************************/
/**
 * Detect the ROI
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} trackingArea Area for tracking
 * @param {SizeInfo} minRoi Minimum size of ROI
 * @param {SizeInfo} strideRatio Ratio for ROI area stride
 * @param {functionClassifyFuncPtr} classify Function for classifying
 * @param {RectInfo*} resultRoiPtr (output) New ROI area to found
 * @return {boolean} Whether is find new ROI
 */
exports.detectRoi = (
  trackingArea,
  minRoi,
  strideRatio,
  classify,
  resultRoiPtr
) => {
  return visionlib.detect_roi(
    trackingArea,
    minRoi,
    strideRatio,
    classify,
    resultRoiPtr
  );
};

/**********************************************************
 * detect/haar.h - typedef 있음
 **********************************************************/
/**
 * Get the area of HAAR cascade processing
 * @param {ImageInfo*} imageInfoPtr Source image info
 * @param {RectInfo} subArea ROI area to detect
 * @param {haarOptionsPtr} optionsPtr Options for HAAR detection
 * @param {ListInfo*} resultRectListPtr (output) Result areas info
 */
exports.getHaarCascadeDetect = (
  imageInfoPtr,
  subArea,
  optionsPtr,
  resultRectListPtr
) => {
  visionlib.get_haar_cascade_detect(
    imageInfoPtr,
    subArea,
    optionsPtr,
    resultRectListPtr
  );
};

/**
 * Draw the area to the image
 * @param {ImageInfo*} imageInfoPtr Image to draw
 * @param {ListInfo*} resultRectListPtr Result list of area info
 */
exports.drawHaarResult = (imageInfoPtr, resultRectListPtr) => {
  visionlib.draw_haar_result(imageInfoPtr, resultRectListPtr);
};

/**********************************************************
 * detect/track.h - typedef 있음
 **********************************************************/

/**
 * Track the ROI
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} trackingArea Area for tracking
 * @param {SizeInfo} minRoi Minimum size of ROI
 * @param {SizeInfo} strideRatio Ratio for ROI area stride
 * @param {functionClassifyFuncPtr} classify Function for classifying
 * @param {RectInfo*} resultRoiPtr (output) New ROI area to found
 * @return {boolean} Whether is find new ROI
 */
exports.trackRoi = (
  trackingArea,
  minRoi,
  strideRatio,
  classify,
  resultRoiPtr
) => {
  return visionlib.track_roi(
    trackingArea,
    minRoi,
    strideRatio,
    classify,
    resultRoiPtr
  );
};

/**********************************************************
 * edge/canny.h - typedef 있음
 **********************************************************/
/**
 * @param {ImageInfo} ImageInfoStr
 * @param {RobertsOptions} RobertsOptionsStr
 * @return {ImageInfo} (output) Result ImageInfoStr
 */
exports.edgeCanny = (imageInfoStr, optionsStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // blur processing
  let blurImageStr = new datatypes.ImageInfo({
    data: imageInfoStr.data,
    size: imageInfoStr.size,
    color: imageInfoStr.color,
    bytes_per_pixel: imageInfoStr.bytes_per_pixel,
    coordinate: imageInfoStr.coordinate,
  });

  if (optionsStr.blur !== constants.BLUR_TYPE.BLUR_NONE) {
    // Create blur buffer
    var blurImageSize =
      blurImageStr.size.width *
      blurImageStr.size.height *
      blurImageStr.bytes_per_pixel *
      Uint8Array.BYTES_PER_ELEMENT;

    blurImageStr.data = Buffer.from(new Uint8Array(blurImageSize).buffer);

    switch (optionsStr.blur) {
      case constants.BLUR_TYPE.BLUR_AVERAGE:
        this.getAverageBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_MEDIAN:
        this.getMedianBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_BILATERAL:
        this.getBilateralBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_GAUSSIAN:
        // this.getGaussianBlur(imageInfoPtr, blurImageStr.data);
        break;
    }
  }

  // grayscale processing
  let blurImagePtr = ref.alloc(datatypes.ImageInfo, blurImageStr);

  let grayscaleImageStr = new datatypes.ImageInfo({
    data: blurImageStr.data,
    size: blurImageStr.size,
    color: blurImageStr.color,
    bytes_per_pixel: blurImageStr.bytes_per_pixel,
    coordinate: blurImageStr.coordinate,
  });

  if (blurImageStr.color !== constants.COLOR_FORMAT.COLOR_GRAY) {
    // Create grayscale buffer
    var grayscaleImageSize =
      grayscaleImageStr.size.width *
      grayscaleImageStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;
    grayscaleImageStr.data = Buffer.from(
      new Uint8Array(grayscaleImageSize).buffer
    );

    this.getGrayscaleImageRaw(blurImagePtr, grayscaleImageStr.data);
    grayscaleImageStr.color = constants.COLOR_FORMAT.COLOR_GRAY;
    grayscaleImageStr.bytes_per_pixel = this.getBytesPerPixel(
      grayscaleImageStr.color
    );
  }

  // edge processing
  let edgeMagnitudePtr = Buffer.from(
    new Uint16Array(grayscaleImageSize).buffer
  );
  let edgeGradientPtr = Buffer.from(new Uint16Array(grayscaleImageSize).buffer);
  switch (optionsStr.edge) {
    case constants.EDGE_TYPE.EDGE_SOBEL:
      let sobelOptionsStr = new datatypes.SobelOptions();
      sobelOptionsStr.use_math = optionsStr.use_math;
      sobelOptionsStr.threshold_ratio = -1;
      sobelOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
    case constants.EDGE_TYPE.EDGE_PREWITT:
      let prewittOptionsStr = new datatypes.PrewittOptions();
      prewittOptionsStr.use_math = optionsStr.use_math;
      prewittOptionsStr.threshold_ratio = -1;
      prewittOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
    case constants.EDGE_TYPE.EDGE_ROBERTS:
      let robertsOptionsStr = new datatypes.RobertsOptions();
      robertsOptionsStr.use_math = optionsStr.use_math;
      robertsOptionsStr.threshold_ratio = -1;
      robertsOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
  }

  let resultImageStr = new datatypes.ImageInfo({
    data: grayscaleImageStr.data,
    size: grayscaleImageStr.size,
    color: grayscaleImageStr.color,
    bytes_per_pixel: grayscaleImageStr.bytes_per_pixel,
    coordinate: grayscaleImageStr.coordinate,
  });

  if (
    imageInfoStr.color === constants.COLOR_FORMAT.COLOR_GRAY &&
    optionsStr.blur === constants.BLUR_TYPE.BLUR_NONE
  ) {
    resultImageStr.data = Buffer.from(new Uint8Array(grayscaleImageSize));
  }
  let resultImagePtr = ref.alloc(datatypes.ImageInfo, resultImageStr);

  let cannyOptionsStr = new datatypes.CannyOptions();
  cannyOptionsStr.threshold_high_ratio = optionsStr.threshold_high_ratio;
  cannyOptionsStr.threshold_low_ratio = optionsStr.threshold_low_ratio;
  let cannyOptionsPtr = ref.alloc(datatypes.CannyOptions, cannyOptionsStr);

  this.getCannyEdge(
    resultImageStr.size,
    edgeMagnitudePtr,
    edgeGradientPtr,
    cannyOptionsPtr,
    resultImagePtr
  );

  return resultImagePtr.deref();
};

/**
 * Get the edge image using sobel edge extraction
 * @param {SizeInfo} imageSize Image size
 * @param {uint8*} edgeMagnitudeVectorPtr Edge magnitude info
 * @param {uint8*} edgeGradientVector Edge gradient info (0~4, 0:virtical edge, 1:left-up and right-down edge, 2:horizontal edge, 3:right-up and left-down edge)
 * @param {cannyOptionsPtr} options Options for edge extraction
 * @param {ImageInfo*} resultImagePtr (output) Result image info
 */
exports.getCannyEdge = (
  imageSize,
  edgeMagnitudeVectorPtr,
  edgeGradientVectorPtr,
  optionsPtr,
  resultImagePtr
) => {
  visionlib.get_canny_edge(
    imageSize,
    edgeMagnitudeVectorPtr,
    edgeGradientVectorPtr,
    optionsPtr,
    resultImagePtr
  );
};

/**
 * Define the function for calculate gradient to get canny feature vector
 * @param {uint16} verticalMagnitude Value of vertival magnitude
 * @param {uint16} horizontalMagnitude Value of horizontal magnitude
 * @param {boolean} useMath Whether to use math function
 * @return {uint16} Calculated value (0~4, 0:virtical edge, 1:left-up and right-down edge, 2:horizontal edge, 3:right-up and left-down edge)
 */
exports.calculateCannyGradient = (
  verticalMagnitude,
  horizontalMagnitude,
  useMath
) => {
  return visionlib.calculate_canny_gradient(
    verticalMagnitude,
    horizontalMagnitude,
    useMath
  );
};

/**********************************************************
 * edge/hough.h - typedef 있음
 **********************************************************/
// edgeCanny와 동일.
exports.edgeHoughLine = (imageInfoStr, optionsStr) => {
  let cannyResultStr = this.edgeCanny(imageInfoStr, optionsStr);

  let resultListPtr = this.createList();
};
/**
 * Get the line edge in image
 * @param {ImageInfo*} imageInfoPtr Source image info
 * @param {houghLineOptionsPtr} optionsPtr Options for edge extraction
 * @param {listInfoPtr} edgeListPtr (output) Result list of line info
 */
exports.getHoughEdgeLine = (imageInfoPtr, optionsPtr, edgeListPtr) => {
  visionlib.get_hough_edge_line(imageInfoPtr, optionsPtr, edgeListPtr);
};

/**
 * Get the circle edge in image
 * @param {ImageInfo*} imageInfoPtr Source image info
 * @param {houghCircleOptionsPtr} optionsPtr Options for edge extraction
 * @param {listInfoPtr} edgeListPtr (output) Result list of circle info
 */
exports.getHoughEdgeCircle = (imageInfoPtr, optionsPtr, edgeListPtr) => {
  visionlib.get_hough_edge_circle(imageInfoPtr, optionsPtr, edgeListPtr);
};

/**
 * Draw the line edge to the image
 * @param {ListInfo*} resultInfoPtr Result list of line info
 * @param {ImageInfo*} imageInfoPtr (output) Line drawn image
 */
exports.drawHoughLineResult = (resultInfoPtr, imageInfoPtr) => {
  visionlib.draw_hough_line_result(resultInfoPtr, imageInfoPtr);
};

/**
 * Draw the circle edge to the image
 * @param {ListInfo*} resultInfoPtr Result list of circle info
 * @param {ImageInfo*} imageInfoPtr (output) Circle drawn image
 */
exports.drawHoughCircleResult = (resultInfoPtr, imageInfoPtr) => {
  visionlib.draw_hough_circle_result(resultInfoPtr, imageInfoPtr);
};

/**********************************************************
 * edge/prewitt.h - typedef 있음
 **********************************************************/
/**
 * @param {ImageInfo} ImageInfoStr
 * @param {PrewittOptions} PrewittOptionsStr
 * @return {Array<Number>} (output)
 */
exports.edgePrewitt = (imageInfoStr, optionsStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create grayscale buffer
  let resultSize =
    imageInfoStr.size.width *
    imageInfoStr.size.height *
    Uint8Array.BYTES_PER_ELEMENT;

  let resultImagePtr = Buffer.from(new Uint8Array(resultSize).buffer);

  // Call function (color to grayscale)
  this.getGrayscaleImageRaw(imageInfoPtr, resultImagePtr);

  // get values from Buffer (result)
  let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
  let grayscaleData = ref.reinterpret(resultImagePtr, bytes);

  // re-create
  imageInfoStr.data = grayscaleData;
  imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create pointer
  let optionsPtr = ref.alloc(datatypes.SobelOptions, optionsStr);

  // Call functioon
  this.getPrewittEdge(imageInfoPtr, optionsPtr, resultImagePtr);

  // get values from Buffer (result)
  let result = ref.reinterpret(resultImagePtr, bytes);

  return result;
};

/**
 * @param {ImageInfo*} imageInfoPtr
 * @param {PrewittOptions*} prewittOptionsPtr
 * @param {uint8*} edgeMagnitudeVectorPtr
 */
exports.getPrewittEdge = (
  imageInfoPtr,
  prewittOptionsPtr,
  edgeMagnitudeVectorPtr
) => {
  visionlib.get_prewitt_edge(
    imageInfoPtr,
    prewittOptionsPtr,
    edgeMagnitudeVectorPtr
  );
};

/**
 * @param {ImageInfo*} imageInfoPtr
 * @param {PrewittOptions*} prewittOptionsPtr
 * @param {uint16*} edgeMagnitudeVectorPtr
 * @param {uint16*} edgeGradientVectorPtr
 */
exports.getPrewittEdgeWithGradient = (
  imageInfoPtr,
  prewittOptionsPtr,
  edgeMagnitudeVectorPtr,
  edgeGradientVectorPtr
) => {
  visionlib.get_prewitt_edge_with_gradient(
    imageInfoPtr,
    prewittOptionsPtr,
    edgeMagnitudeVectorPtr,
    edgeGradientVectorPtr
  );
};

/**********************************************************
 * edge/roberts.h - typedef 있음
 **********************************************************/
/**
 * @param {ImageInfo} ImageInfoStr
 * @param {RobertsOptions} RobertsOptionsStr
 * @return {Array<Number>} (output)
 */
exports.edgeReberts = (imageInfoStr, optionsStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create grayscale buffer
  let resultSize =
    imageInfoStr.size.width *
    imageInfoStr.size.height *
    Uint8Array.BYTES_PER_ELEMENT;

  let resultImagePtr = Buffer.from(new Uint8Array(resultSize).buffer);

  // Call function (color to grayscale)
  this.getGrayscaleImageRaw(imageInfoPtr, resultImagePtr);

  // get values from Buffer (result)
  let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
  let grayscaleData = ref.reinterpret(resultImagePtr, bytes);

  // re-create
  imageInfoStr.data = grayscaleData;
  imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create pointer
  let optionsPtr = ref.alloc(datatypes.SobelOptions, optionsStr);

  // Call functioon
  this.getRobertsEdge(imageInfoPtr, optionsPtr, resultImagePtr);

  // get values from Buffer (result)
  let result = ref.reinterpret(resultImagePtr, bytes);

  return result;
};
/**
 * @param {ImageInfo*} imageInfoPtr
 * @param {RobertsOptions*} prewittOptionsPtr
 * @param {uint8*} edgeMagnitudeVectorPtr
 */
exports.getRobertsEdge = (
  imageInfoPtr,
  robertsOptionsPtr,
  edgeMagnitudeVectorPtr
) => {
  visionlib.get_roberts_edge(
    imageInfoPtr,
    robertsOptionsPtr,
    edgeMagnitudeVectorPtr
  );
};

/**
 * @param {ImageInfo*} imageInfoPtr
 * @param {RobertsOptions*} prewittOptionsPtr
 * @param {uint16*} edgeMagnitudeVectorPtr
 * @param {uint16*} edgeGradientVectorPtr
 */
exports.getRobertsEdgeWithGradient = (
  imageInfoPtr,
  robertsOptionsPtr,
  edgeMagnitudeVectorPtr,
  edgeGradientVectorPtr
) => {
  visionlib.get_roberts_edge_with_gradient(
    imageInfoPtr,
    robertsOptionsPtr,
    edgeMagnitudeVectorPtr,
    edgeGradientVectorPtr
  );
};

/**********************************************************
 * edge/sobel.h - typedef 있음
 **********************************************************/
/**
 * @param {ImageInfo} ImageInfoStr
 * @param {SobelOptions} SobelOptionsStr
 * @return {Array<Number>} (output)
 */
exports.edgeSobel = (imageInfoStr, optionsStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create grayscale buffer
  let resultSize =
    imageInfoStr.size.width *
    imageInfoStr.size.height *
    Uint8Array.BYTES_PER_ELEMENT;

  let resultImagePtr = Buffer.from(new Uint8Array(resultSize).buffer);

  // Call function (color to grayscale)
  this.getGrayscaleImageRaw(imageInfoPtr, resultImagePtr);

  // get values from Buffer (result)
  let bytes = resultSize * Uint8Array.BYTES_PER_ELEMENT;
  let grayscaleData = ref.reinterpret(resultImagePtr, bytes);

  // re-create
  imageInfoStr.data = grayscaleData;
  imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create pointer
  let optionsPtr = ref.alloc(datatypes.SobelOptions, optionsStr);

  // Call functioon
  this.getSobelEdge(imageInfoPtr, optionsPtr, resultImagePtr);

  // get values from Buffer (result)
  let result = ref.reinterpret(resultImagePtr, bytes);

  return result;
};

/**
 * Run the sobel edge processing
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SobelOptions*} sobelOptionsPtr Options for the edge processing
 * @param {uint8*} edgeMagnitudeVectorPtr (output) Edge magnitude
 */
exports.getSobelEdge = (
  imageInfoPtr,
  sobelOptionsPtr,
  edgeMagnitudeVectorPtr
) => {
  visionlib.get_sobel_edge(
    imageInfoPtr,
    sobelOptionsPtr,
    edgeMagnitudeVectorPtr
  );
};

/**
 * Run the sobel edge processing
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SobelOptions*} sobelOptionsPtr Options for the edge processing
 * @param {uint16*} edgeMagnitudeVectorPtr (output) Edge magnitude
 * @param {uint16*} edgeGradientVectorPtr (output) Edge gradient
 */
exports.getSobelEdgeWithGradient = (
  imageInfoPtr,
  sobelOptionsPtr,
  edgeMagnitudeVectorPtr,
  edgeGradientVectorPtr
) => {
  visionlib.get_sobel_edge_with_gradient(
    imageInfoPtr,
    sobelOptionsPtr,
    edgeMagnitudeVectorPtr,
    edgeGradientVectorPtr
  );
};

/**********************************************************
 * feature/edgegap.h - define 있음
 **********************************************************/
/**
 * Get the feature vector using edge gap
 * @param {ImageInfo*} imageInfoPtr  Image info
 * @param {SizeInfo} lineNum Line count for calculate edge gap
 * @param {uint8*} edgeGapFeature (output) Feature vector
 */
exports.getEdgeGapFeature = (imageInfoPtr, lineNum, edgeGapFeature) => {
  visionlib.get_edge_gap_feature(imageInfoPtr, lineNum, edgeGapFeature);
};

/**********************************************************
 * feature/hog.h - typedef 있음 / - define 있음
 **********************************************************/
exports.featureHog = (imageInfoStr, optionsStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // blur processing
  let blurImageStr = new datatypes.ImageInfo({
    data: imageInfoStr.data,
    size: imageInfoStr.size,
    color: imageInfoStr.color,
    bytes_per_pixel: imageInfoStr.bytes_per_pixel,
    coordinate: imageInfoStr.coordinate,
  });

  if (optionsStr.blur !== constants.BLUR_TYPE.BLUR_NONE) {
    // Create blur buffer
    let blurImageSize =
      blurImageStr.size.width *
      blurImageStr.size.height *
      blurImageStr.bytes_per_pixel *
      Uint8Array.BYTES_PER_ELEMENT;

    blurImageStr.data = Buffer.from(new Uint8Array(blurImageSize).buffer);

    switch (optionsStr.blur) {
      case constants.BLUR_TYPE.BLUR_AVERAGE:
        this.getAverageBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_MEDIAN:
        this.getMedianBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_BILATERAL:
        this.getBilateralBlur(imageInfoPtr, blurImageStr.data);
        break;
      case constants.BLUR_TYPE.BLUR_GAUSSIAN:
        // this.getGaussianBlur(imageInfoPtr, blurImageStr.data);
        break;
    }
  }

  // grayscale processing
  let blurImagePtr = ref.alloc(datatypes.ImageInfo, blurImageStr);

  let grayscaleImageStr = new datatypes.ImageInfo({
    data: blurImageStr.data,
    size: blurImageStr.size,
    color: blurImageStr.color,
    bytes_per_pixel: blurImageStr.bytes_per_pixel,
    coordinate: blurImageStr.coordinate,
  });

  if (blurImageStr.color !== constants.COLOR_FORMAT.COLOR_GRAY) {
    // Create grayscale buffer
    var grayscaleImageSize =
      grayscaleImageStr.size.width *
      grayscaleImageStr.size.height *
      Uint8Array.BYTES_PER_ELEMENT;
    grayscaleImageStr.data = Buffer.from(
      new Uint8Array(grayscaleImageSize).buffer
    );

    this.getGrayscaleImageRaw(blurImagePtr, grayscaleImageStr.data);
    grayscaleImageStr.color = constants.COLOR_FORMAT.COLOR_GRAY;
    grayscaleImageStr.bytes_per_pixel = this.getBytesPerPixel(
      grayscaleImageStr.color
    );
  }

  // edge processing
  let edgeMagnitudePtr = Buffer.from(
    new Uint16Array(grayscaleImageSize).buffer
  );
  let edgeGradientPtr = Buffer.from(new Uint16Array(grayscaleImageSize).buffer);
  switch (optionsStr.edge) {
    case constants.EDGE_TYPE.EDGE_SOBEL:
      let sobelOptionsStr = new datatypes.SobelOptions();
      sobelOptionsStr.use_math = optionsStr.use_math;
      sobelOptionsStr.threshold_ratio = -1;
      sobelOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
    case constants.EDGE_TYPE.EDGE_PREWITT:
      let prewittOptionsStr = new datatypes.PrewittOptions();
      prewittOptionsStr.use_math = optionsStr.use_math;
      prewittOptionsStr.threshold_ratio = -1;
      prewittOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
    case constants.EDGE_TYPE.EDGE_ROBERTS:
      let robertsOptionsStr = new datatypes.RobertsOptions();
      robertsOptionsStr.use_math = optionsStr.use_math;
      robertsOptionsStr.threshold_ratio = -1;
      robertsOptionsStr.calculate_gradient = this.calculateCannyGradient;
      break;
  }

  // Create pointer
  let optionsPtr = ref.alloc(datatypes.featureHogOptions, optionsStr);

  // Create result buffer
  let hogVector = new datatypes.VectorInfo();
  let hogVectorPtr = ref.alloc(datatypes.VectorInfo, hogVector);
  let hogVectorPtrPtr = ref.alloc(datatypes.VectorInfo, hogVectorPtr);

  // 아래 함수를 실행시키면 프로그램이 멈춘다 ㅠㅠ
  // this.getHogFeature(grayscaleImageStr.size, edgeMagnitudePtr, edgeGradientPtr, optionsPtr, hogVectorPtrPtr);

  return null;
};

/**
 * Get the HOG feature vector
 * @param {SizeInfo} imageSize Image size
 * @param {uint16*} edgeMagnitudePtr Edge magnitude info
 * @param {uint16*} edgeGradientPtr Edge gradient info (0~359)
 * @param {hogOptionsPtr} optionsPtr Options to calculate for HOG feature vector
 * @param {vectorInfoPtrPtr} hogFeaturePtrPtr (output) HOG feature vector
 */
exports.getHogFeature = (
  imageSize,
  edgeMagnitudePtr,
  edgeGradientPtr,
  optionsPtr,
  hogFeaturePtrPtr
) => {
  visionlib.get_hog_feature(
    imageSize,
    edgeMagnitudePtr,
    edgeGradientPtr,
    optionsPtr,
    hogFeaturePtrPtr
  );
};

/**
 * Define the function for calculate gradient to get HOG feature vector
 * @param {uint16} verticalMagnitude Value of vertival magnitude
 * @param {uint16} horizontalMagnitude Value of horizontal magnitude
 * @param {boolean} useMath Whether to use math function
 * @return {uint16} Calculated value (0~359)
 */
exports.calculateHogGradient = (
  verticalMagnitude,
  horizontalMagnitude,
  useMath
) => {
  return visionlib.calculate_hog_gradient(
    verticalMagnitude,
    horizontalMagnitude,
    useMath
  );
};

/**********************************************************
 * feature/lbp.h
 **********************************************************/
/**
 * Get the LBP feature vector
 * @param {ImageInfo*} imageInfoPtr Image source
 * @param {uniformLbpFeaturePtrPtr} uniformLbpFeaturePtrPtr (output) LBP feature vector
 */
exports.getUniformLbpFeature = (imageInfoPtr, uniformLbpFeaturePtrPtr) => {
  visionlib.get_uniform_lbp_feature(imageInfoPtr, uniformLbpFeaturePtrPtr);
};

/***********************************************************
 * feature/subsample.h - define 있음
 **********************************************************/
exports.subsample = (imageInfoStr, optionsStr) => {

  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  // Create result buffer
  let resultVectorPtr = Buffer.from(new Uint8Array(constants.MAX_VECTOR_LENGTH).buffer);

  if (optionsStr.is_gray) {
    this.getSubsampleFeature2(
      imageInfoPtr,
      optionsStr.sub_area,
      optionsStr.grid_num,
      resultVectorPtr
    );
  } else {
    this.getSubsampleColorFeature(
      imageInfoPtr,
      optionsStr.sub_area,
      optionsStr.grid_num,
      resultVectorPtr
    );
  }

  // get values from Buffer (result)
  let result = ref.reinterpret(resultVectorPtr, constants.MAX_VECTOR_LENGTH);

  return result;
};

/**
 * Get the feature vector using subsampling
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SizeInfo} gridNum Grid count for subsampling
 * @param {uint8*} subsampleFeaturePtr (output) Feature vector
 */
exports.getSubsampleFeature = (
  imageInfoPtr,
  gridNum,
  getSubsampleColorFeature
) => {
  visionlib.get_subsample_feature(
    imageInfoPtr,
    gridNum,
    getSubsampleColorFeature
  );
};

/**
 * Get the feature vector using subsampling in sub area
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} subArea Sub area info
 * @param {SizeInfo} gridNum Grid count for subsampling
 * @param {uint8*} subsampleFeaturePtr (output) Feature vector
 */
exports.getSubsampleFeature2 = (
  imageInfoPtr,
  subArea,
  gridNum,
  getSubsampleColorFeature
) => {
  visionlib.get_subsample_feature2(
    imageInfoPtr,
    subArea,
    gridNum,
    getSubsampleColorFeature
  );
};

/**
 * Get the color feature vector using subsampling in sub area
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} subArea Sub area info
 * @param {SizeInfo} gridNum Grid count for subsampling
 * @param {uint8*} subsampleFeaturePtr (output) Feature vector
 */
exports.getSubsampleColorFeature = (
  imageInfoPtr,
  subArea,
  gridNum,
  getSubsampleColorFeature
) => {
  visionlib.get_subsample_color_feature(
    imageInfoPtr,
    subArea,
    gridNum,
    getSubsampleColorFeature
  );
};

/***********************************************************
 * utils/bytesperpixel.h - define 있음
 **********************************************************/
/**
 * Get the byte count of pixel
 * @param {ColorFormat} format Color format of pixel
 * @return {uint8} Byte count of pixel
 */
exports.getBytesPerPixel = (format) => {
  return visionlib.get_bytes_per_pixel(format);
};

/***********************************************************
 * utils/crop.h
 **********************************************************/
/**
 * Get the cropped image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @return Cropped image
 */
exports.cropImage = (imageInfoPtr, area) => {
  return visionlib.crop_image(imageInfoPtr, area);
};

/**
 * Get the cropped image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @param {uint8*} croppedImagePtr (output) Cropped image
 */
exports.cropImageRaw = (imageInfoPtr, area, croppedImagePtr) => {
  visionlib.crop_image_raw(imageInfoPtr, area, croppedImagePtr);
};

/***********************************************************
 * utils/equalize.h
 **********************************************************/
/**
 * Equalize GRAY Histogram
 * @param {ImageInfo*} source Source image
 * @param {ImageInfo*} destination Destination image
 */
exports.equalizeGrayHistogram = (sourcePtr, destinationPtr) => {
  visionlib.equalize_gray_histogram(sourcePtr, destinationPtr);
};

/***********************************************************
 * utils/grayscale.h
 **********************************************************/
/**
 * Get the grayscale image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @return {ImageInfo*} Grayscale image
 */
exports.getGrayscaleImage = (imageInfoPtr) => {
  return visionlib.get_grayscale_image(imageInfoPtr);
};

/**
 * Get the grayscale image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {uint8*} grayImagePtr (output) Grayscale image
 */
exports.getGrayscaleImageRaw = (imageInfoPtr, grayImagePtr) => {
  visionlib.get_grayscale_image_raw(imageInfoPtr, grayImagePtr);
};

/**
 * Get the grayscale image in the sub area
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @return {ImageInfo*} Grayscale image
 */
exports.getGrayscaleImage2 = (imageInfoPtr, area) => {
  return visionlib.get_grayscale_image2(imageInfoPtr, area);
};

/**
 * Get the grayscale image in the sub area
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @param {uint8*} grayImagePtr (output) Grayscale image
 */
exports.getGrayscaleImageRaw2 = (imageInfoPtr, area, grayImagePtr) => {
  visionlib.get_grayscale_image_raw2(imageInfoPtr, area, grayImagePtr);
};

/***********************************************************
 * utils/image.h
 ***********************************************************/
/**
 * Create the image info
 * @param {SizeInfo} size Image size
 * @param {ColorFormat} format Color format of pixel
 * @return {ImageInfo*} Image info
 */
exports.createImage = (size, format) => {
  return visionlib.create_image(size, format);
};

/**
 * Create the image info
 * @param {SizeInfo} size Image size
 * @param {ColorFormat} format Color format of pixel
 * @param {Coordinate Type} coordinate Origin point of coordinate
 * @return {ImageInfo*} Image info
 */
exports.createImageWithCoordinate = (size, format, coordinate) => {
  return visionlib.create_image_with_coordinate(size, format, coordinate);
};

/**
 * Create the image info
 * @param {ImageInfo*} imageInfoPtr Source image info
 * @return {ImageInfo*} Image info
 */
exports.createImageFromImage = (imageInfoPtr) => {
  return visionlib.create_image_from_image(imageInfoPtr);
};

/**
 * Destroy the image info
 * @param {ImageInfo*} imageInfoPtr Image info
 */
exports.destroyImage = (imageInfoPtr) => {
  visionlib.destroy_image(imageInfoPtr);
};

/**
 * Free the memory of image info
 * @param {ImageInfo*} imageInfoPtr Image info
 */
exports.freeImage = (imageInfoPtr) => {
  visionlib.free_image(imageInfoPtr);
};

/**
 * Definition the callback function to free the memory of image info
 * @param {ImageInfo*} imageInfoPtr Image info
 */
exports.functionImageFreeListData = (imageInfoPtr) => {
  visionlib.function_image_free_list_data(imageInfoPtr);
};

/***********************************************************
 * utils/list.h
 ***********************************************************/
/**
 * Create the list structure
 * @return {ListInfo*} List structure
 */
exports.createList = () => {
  return visionlib.create_list();
};

/**
 * Delete the node in list
 * @param {ListInfo*} listPtr List structure
 * @param {callbackFreeDataPtr} freeData Functions for free the node data
 */
exports.clearList = (listPtr, freeData) => {
  visionlib.clear_list(listPtr, freeData);
};

/**
 * Delete the node in list and remove the list
 * @param {ListInfo*} listPtr List structure
 * @param {callbackFreeDataPtr} free_data Functions for free the node data
 */
exports.destroyList = (listPtr, freeData) => {
  visionlib.destroy_list(listPtr, freeData);
};

/**
 * Get the node at specific position of list
 * @param {list_info*} listPtr List structure
 * @param {uint32} index Node index
 * @return {ListNode*} List node
 */
exports.getNodeFromListAt = (listPtr, freeData) => {
  return visionlib.get_node_from_list_at(listPtr, freeData);
};

/**
 * Get the node's data at head of list
 * @param {list_info*} listPtr List structure
 * @return {void*} Node data
 */
exports.getDataFromListHead = (listPtr) => {
  return visionlib.get_data_from_list_head(listPtr);
};

/**
 * Get the node's data at tail of list
 * @param {list_info*} listPtr List structure
 * @return {void*} Node data
 */
exports.getDataFromListTail = (listPtr) => {
  return visionlib.get_data_from_list_tail;
};

/**
 * Get the node's data at specific position of list
 * @param {ListInfo*} listPtr List structure
 * @param {uint32} index Node index
 * @return {void*} Node data
 */
exports.getDataFromListAt = (listPtr, index) => {
  return visionlib.get_data_from_list_at(listPtr, index);
};

/**
 * Insert the data to head of list
 * @param {ListInfo*} listPtr List structure
 * @param {void*} dataPtr Node data
 */
exports.pushDataToListHead = (listPtr, dataPtr) => {
  visionlib.push_data_to_list_head(listPtr, dataPtr);
};

/**
 * Insert the data to tail of list
 * @param {ListInfo*} listPtr List structure
 * @param {void*} dataPtr Node data
 */
exports.pushDataToListTail = (listPtr, dataPtr) => {
  visionlib.push_data_to_list_tail((listPtr, dataPtr));
};

/**
 * Insert the data to specific position of list
 * @param {ListInfo*} listPtr List structure
 * @param {uint32} index Node index
 * @param data Node data
 */
exports.pushDataToListAt = (listPtr, index, dataPtr) => {
  visionlib.push_data_to_list_at(listPtr, index, dataPtr);
};

/**
 * Extract the data from head of list
 * @param {ListInfo*} listPtr List structure
 * @return {void*} Node data
 */
exports.popDataFromListHead = (listPtr) => {
  return visionlib.pop_data_from_list_head(listPtr);
};

/**
 * Extract the data from tail of list
 * @param {ListInfo*} listPtr List structure
 * @return {void*} Node data
 */
exports.popDataFromListTail = (listPtr) => {
  return visionlib.pop_data_from_list_tail(listPtr);
};

/**
 * Extract the data from specific position of list
 * @param {ListInfo*} listPtr List structure
 * @param {uint32} index Node index
 * @return {void*} Node data
 */
exports.popDataFromListAt = (listPtr, index) => {
  return visionlib.pop_data_from_list_at(listPtr, index);
};

/**
 * Remove the data from head of list
 * @param {ListInfo*} listPtr List structure
 * @param {callbackFreeDataPtr} freeData Functions for free the node data
 */
exports.removeFromListHead = (listPtr, freeData) => {
  visionlib.removeFromListHead(listPtr, freeData);
};

/**
 * Remove the data from tail of list
 * @param {ListInfo*} listPtr List structure
 * @param {callbackFreeDataPtr} freeData Functions for free the node data
 */
exports.removeFromListTail = (listPtr, freeData) => {
  visionlib.remove_from_list_tail(listPtr, freeData);
};

/**
 * Remove the data from specific position of list
 * @param {ListInfo*} listPtr List structure
 * @param {uint32} index Node index
 * @param {callbackFreeDataPtr} freeData Functions for free the node data
 */
exports.removeFromListAt = (listPtr, index, freeData) => {
  visionlib.remove_from_list_at(listPtr, index, freeData);
};

/***********************************************************
 * utils/pixelaverage.h
 ***********************************************************/
/**
 * Get the color average value of pixel color in the sub area of image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @param {ColorInfo*} pixelPtr (output) Average value of pixel color
 */
exports.getPixelAverageColor = (imageInfoPtr, area, pixelPtr) => {
  visionlib.get_pixel_average_color(imageInfoPtr, area, pixelPtr);
};

/**
 * Set the color average value of pixel color in the sub area of image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} area Sub area
 * @param {ColorInfo*} pixelPtr (output) Average value of pixel color
 */
exports.getPixelAverageGray = (imageInfoPtr, area, pixelPtr) => {
  visionlib.get_pixel_average_gray(imageInfoPtr, area, pixelPtr);
};

/***********************************************************
 * utils/pixelcolor.h
 ***********************************************************/
/**
 * Get the pixel color in image
 * @param {uint8*} pixel_position Pixel position in image
 * @param {ColorFormat} format Color format of pixel
 * @param {ColorInfo*} pixel_color (output) Pixel color to got
 */
exports.getPixelColor = (pixelPositionPtr, format, pixelColorPtr) => {
  visionlib.get_pixel_color(pixelPositionPtr, format, pixelColorPtr);
};

/**
 * Get the pixel color in image
 * @param {uint8*} pixelPositionPtr Pixel position in image
 * @param {ColorFormat} format Color format of pixel
 * @param {ColorInfo*} pixelColorPtr (output) Pixel color to got
 */
exports.setPixelColor = (pixelPositionPtr, format, pixelColorPtr) => {
  visionlib.set_pixel_color(pixelPositionPtr, format, pixelColorPtr);
};

/***********************************************************
 *  utils/resize.h
 ***********************************************************/
/**
 * Resize image
 * @param {ImageInfo} imageInfoStr ImageInfoStr of input image
 * @param {SizeInfo} targetSizeStr resize size
 * @return {Array<number>} (output) raw data result of resized image
 */
exports.resize = (imageInfoStr, targetSizeStr) => {
  // Create pointer
  let imageInfoPtr = ref.alloc(datatypes.ImageInfo, imageInfoStr);

  let resultImageInfoPtr = this.resizeImage(imageInfoPtr, targetSizeStr);
  let resultImageInfoStr = resultImageInfoPtr.deref();

  // Create result buffer
  let resultSize =
    resultImageInfoStr.size.width *
    resultImageInfoStr.size.height *
    resultImageInfoStr.bytes_per_pixel *
    Uint8Array.BYTES_PER_ELEMENT;

  // get values from Buffer (result)
  let result = ref.reinterpret(resultImageInfoStr.data, resultSize);

  return result;
};

/**
 * Resize the image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SizeInfo} targetSize Target size to resize
 * @return {ImageInfo*} Resized image
 */
exports.resizeImage = (imageInfoPtr, targetSize) => {
  return visionlib.resize_image(imageInfoPtr, targetSize);
};

/**
 * Resize the image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SizeInfo} targetSize Target size to resize
 * @param {ResizeType} type Type of resize
 * @return {ImageInfo*} Resized image
 */
exports.resizeToGrayscaleImage = (imageInfoPtr, targetSize, type) => {
  return visionlib.resize_to_grayscale_image(imageInfoPtr, targetSize, type);
};

/**
 * Resize the image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {SizeInfo} targetSize Target size to resize
 * @param {ResizeType} type Type of resize
 * @param {ImageInfo*} resizedImagePtr (output) Resized image
 */
exports.resizeToGrayscaleImageRaw = (
  imageInfoPtr,
  targetSize,
  type,
  resizedImagePtr
) => {
  visionlib.resize_to_grayscale_image_raw(
    imageInfoPtr,
    targetSize,
    type,
    resizedImagePtr
  );
};

/**
 * Resize the image in sub area of image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} subArea Sub area
 * @param {SizeInfo} targetSize Target size to resize
 * @param {ResizeType} type Type of resize
 * @return {ImageInfo*} Resized image
 */
exports.resizeToGrayscaleImage2 = (imageInfoPtr, subArea, targetSize, type) => {
  return visionlib.resize_to_grayscale_image2(
    imageInfoPtr,
    subArea,
    targetSize,
    type
  );
};

/**
 * Resize the image in sub area of image
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} subArea Sub area
 * @param {SizeInfo} targetSize Target size to resize
 * @param {ResizeType} type Type of resize
 * @param {ImageInfo*} resizedImagePtr (output) Resized image
 */
exports.resizeToGrayscaleImageRaw2 = (
  imageInfoPtr,
  subArea,
  targetSize,
  type,
  resizedImagePtr
) => {
  visionlib.resize_to_grayscale_image_raw2(
    imageInfoPtr,
    subArea,
    targetSize,
    type,
    resizedImagePtr
  );
};

/***********************************************************
 * utils/squareroot.h
 **********************************************************/
/**
 *************************************************************************************
 *                      31 30-23           22-0
 * Bit#               : ||------||---------------------|
 * Bit Representation : seeeeeeeemmmmmmmmmmmmmmmmmmmmmmm
 * Value              : sign * 1.mantissa * pow(2, exponent-127)
 *************************************************************************************
 * (((X_int / 2^m) - b) / 2 ) + b) * 2^m = ((X_int - 2^m) / 2) + ((b + 1) / 2) * 2^m)
 *************************************************************************************
 * X_int -= 1 << 23;  // subtract 2^m
 * X_int >>= 1;       // divide by 2
 * X_int += 1 << 29;  // add ((b + 1) / 2) * 2^m
 *************************************************************************************
 * Fast sqrt algorithm
 * @param {float} value Input value
 * @return {float} Sqrt value
 */
exports.getSquareRoot = (value) => {
  return visionlib.get_square_root(value);
};

/***********************************************************
 * utils/targetarea.h
 **********************************************************/
/**
 * Get the target area for tracking or detecting
 * @param {ImageInfo*} imageInfoPtr Image info
 * @param {RectInfo} criterionArea Criterion area
 * @param {SizeInfo} targetAreaRatio Ratio of target area
 * @return {RectInfo} Target area
 */
exports.getTargetArea = (imageInfoPtr, criterionArea, targetAreaRatio) => {
  return visionlib.get_target_area(
    imageInfoPtr,
    criterionArea,
    targetAreaRatio
  );
};

/***********************************************************
 * utils/Vector.h
 **********************************************************/

/**
 * Create the vector info
 * @param {uint32} length Vector length
 * @return {Vectorinfo*} Vector info
 */
exports.createVector = (length) => {

  // return visionlib.create_vector(length);

  let newVectorStr = new datatypes.VectorInfo();
  newVectorStr.vector = Buffer.from(new Uint8Array(length).buffer);
  newVectorStr.length = length;

  let newVectorPtr = ref.alloc(datatypes.VectorInfo, newVectorStr);

  return newVectorPtr;
};

/**
 * Destroy the vector info
 * @param {vector_info*} targetPtr Vector info
 */
exports.destroyVector = (targetPtr) => {
  visionlib.destroy_vector(targetPtr);
};

/**
 * Free the memory of vector info
 * @param {vector_info *} targetPtr Vector info
 */
exports.freeVector = (targetPtr) => {
  visionlib.freeVector(targetPtr);
};

/**
 * Definition the callback function to free the memory of vector info
 * @param {vector_info*} targetPtr Vector info
 */
exports.functionVectorFreeListData = (targetPtr) => {
  visionlib.function_vector_free_list_data(targetPtr);
};

/**
 * Create the 32bit vector info
 * @param {uint32} length Vector length
 * @return {vector32_info*} Vector info
 */
exports.createVector32 = (length) => {
  return visionlib.create_vector32(length);
};

/**
 * Destroy the 32bit vector info
 * @param {vector32_info*} targetPtr Vector info
 */
exports.destroyVector32 = (targetPtr) => {
  visionlib.destroy_vector32(targetPtr);
};

/**
 * Free the memory of 32bit vector info
 * @param {vector32_info*} targetPtr Vector info
 */
exports.freeVector32 = (targetPtr) => {
  visionlib.freeVector32(targetPtr);
};

/**
 * Definition the callback function to free the memory of 32bit vector info
 * @param {void*} targetPtr Vector info
 */
exports.functionVector32FreeListData = (targetPtr) => {
  visionlib.function_vector32_free_list_data(targetPtr);
};

// typedef

/**
 * @typedef ImageInfoPtr
 * @type {Object}
 * @property {uint8} data
 * @property {SizeInfo} size
 * @property {uint8} color
 * @property {uint8} bytes_per_pixel
 * @property {uint8} coordinate
 */
