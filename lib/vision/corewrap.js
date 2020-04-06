// Load modules about ffi
const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Load data
const constants = require('./constants');
const datatypes = require('./datatypes');

// Declare int type
const int16 = ref.types.int16;
const uint8 = ref.types.uint8;
const uint16 = ref.types.uint16;
const uint32 = ref.types.uint32;
const bool = ref.types.bool;

// Declare int pointer type
const uint8Ptr = ref.refType(ref.types.uint8);
const uint16Ptr = ref.refType(ref.types.uint16);
const voidPtr = ref.refType(ref.types.void);

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
const functionCalculateMagnitudePrewittPtr = ffi.Function('void', [
  uint32,
  prewittOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr
]);

const functionCalculateMagnitudeRobertPtr = ffi.Function('void', [
  uint32,
  robertsOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr
]);

const functionCalculateMagnitudeSobelPtr = ffi.Function('void', [
  uint32,
  sobelOptionsPtr,
  uint8,
  int16,
  int16,
  uint16,
  voidPtr,
  uint16Ptr
]);

const callbackFreeDataPtr = ffi.Function('void', [voidPtr]);

// Check OS
const platform = process.platform;

// Global variable for nmengine library
let libvision = null;

// Load appropriate library for the operating platform
if (platform === 'Windows') {
  // libvision = './lib/nmengine.dll'
  // return devices
} else if (platform === 'Linux') {
  // libvision = './lib/libnmengine.so'
} else {
  libvision = './server/lib/vision/libvision.dylib';
}

const visionlib = ffi.Library(libvision, {
  // 20.03.31 test on callback function
  // set_callback_function: ['void', ['pointer']],

  /**
   * utils/bytesperpixel.h
   */
  // uint8_t get_bytes_per_pixel(color_format format),
  get_bytes_per_pixel: [uint8, [uint8]],

  /**
   * utils/vector.h
   */
  // vector_info* create_vector(uint32_t length);
  create_vector: [vectorInfoPtr, [uint32]],

  // void destroy_vector(vector_info *target);
  destroy_vector: ['void', [vectorInfoPtr]],

  // void free_vector(vector_info *target);
  free_vector: ['void', [vectorInfoPtr]],

  // void function_vector_free_list_data(void *target);
  function_vector_free_list_data: ['void', [voidPtr]],

  // vector32_info* create_vector32(uint32_t length);
  create_vector32: [vector32InfoPtr, [uint32]],

  // void destroy_vector32(vector32_info *target);
  destroy_vector32: ['void', [vector32InfoPtr]],

  // void free_vector32(vector32_info *target);
  free_vector32: ['void', [vector32InfoPtr]],

  // void function_vector32_free_list_data(void *target);
  function_vector32_free_list_data: ['void', [voidPtr]],

  /**
   * utils/image.h
   */
  // image_info* create_image(size_info size, color_format format);
  create_image: [imageInfoPtr, [datatypes.SizeInfo, uint8]],

  // image_info* create_image_with_coordinate(size_info size, color_format format, coordinate_type coordinate);
  create_image_with_coordinate: [
    imageInfoPtr,
    [datatypes.SizeInfo, uint8, uint8]
  ],

  // image_info* create_image_from_image(image_info *image);
  create_image_from_image: [imageInfoPtr, [imageInfoPtr]],

  // void destroy_image(image_info *image);
  destroy_image: ['void', [imageInfoPtr]],

  // void free_image(image_info *image);
  free_image: ['void', [imageInfoPtr]],

  // void function_image_free_list_data(void *image);
  function_image_free_list_data: ['void', [voidPtr]],

  /**
   * utils/pixelcolor.h
   */
  // void get_pixel_color(uint8_t *pixel_position, color_format format, color_info *pixel_color)
  get_pixel_color: ['void', [uint8Ptr, uint8, colorInfoPtr]],
  // void set_pixel_color(uint8_t *pixel_position, color_format format, color_info *pixel_color)
  set_pixel_color: ['void', [uint8Ptr, uint8, colorInfoPtr]],

  /**
   * utils/pixelaverage.h
   */
  // void get_pixel_average_color(image_info *image, rect_info area, color_info *pixel);
  get_pixel_average_color: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, colorInfoPtr]
  ],

  // void get_pixel_average_gray(image_info *image, rect_info area, uint8_t *pixel);
  get_pixel_average_gray: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, uint8Ptr]
  ],

  /**
   * utils/list.h - typedef 있음
   */
  // typedef void (*callback_free_data)(void *node); ???

  // list_info* create_list();
  create_list: [listInfoPtr, []],

  // void clear_list(list_info *list, callback_free_data free_data);
  create_list: ['void', [listInfoPtr, callbackFreeDataPtr]],

  // void destroy_list(list_info *list, callback_free_data free_data);
  destroy_list: ['void', [listInfoPtr, callbackFreeDataPtr]],

  // list_node* get_node_from_list_at(list_info *list, uint32_t index);
  get_node_from_list_at: [listNodePtr, [listInfoPtr, uint32]],

  // void* get_data_from_list_head(list_info *list);
  get_data_from_list_head: ['void *', [listInfoPtr]],

  // void* get_data_from_list_tail(list_info *list);
  get_data_from_list_tail: ['void *', [listInfoPtr]],

  //void* get_data_from_list_at(list_info *list, uint32_t index);
  get_data_from_list_at: ['void *', [listInfoPtr, uint32]],

  //void push_data_to_list_head(list_info *list, void *data);
  push_data_to_list_head: ['void', [listInfoPtr, 'void *']],

  // void push_data_to_list_tail(list_info *list, void *data);
  push_data_to_list_tail: ['void', [listInfoPtr, 'void *']],

  // void push_data_to_list_at(list_info *list, uint32_t index, void *data);
  push_data_to_list_at: ['void', [listInfoPtr, uint32, 'void *']],

  // void* pop_data_from_list_head(list_info *list);
  pop_data_from_list_head: ['void *', [listInfoPtr]],

  // void* pop_data_from_list_tail(list_info *list);
  pop_data_from_list_tail: ['void *', [listInfoPtr]],

  // void* pop_data_from_list_at(list_info *list, uint32_t index);
  pop_data_from_list_at: ['void *', [listInfoPtr, uint32]],

  // void remove_from_list_head(list_info *list, callback_free_data free_data);
  remove_from_list_head: ['void', [listInfoPtr, callbackFreeDataPtr]],

  // void remove_from_list_tail(list_info *list, callback_free_data free_data);
  remove_from_list_tail: ['void', [listInfoPtr, callbackFreeDataPtr]],

  // void remove_from_list_at(list_info *list, uint32_t index, callback_free_data free_data);
  remove_from_list_at: ['void', [listInfoPtr, uint32, callbackFreeDataPtr]],

  /**
   * utils/crop.h
   */
  // image_info* crop_image(image_info *image, rect_info area);
  crop_image: [imageInfoPtr, [imageInfoPtr, datatypes.RectInfo]],

  // void crop_image_raw(image_info *image, rect_info area, uint8_t *cropped_image);
  crop_image_raw: ['void', [imageInfoPtr, datatypes.RectInfo, uint8Ptr]],

  /**
   * utils/grayscale.h
   */
  // image_info* get_grayscale_image(image_info *image);
  get_grayscale_image: [imageInfoPtr, [imageInfoPtr]],

  // void get_grayscale_image_raw(image_info *image, uint8_t *gray_image);
  get_grayscale_image_raw: ['void', [imageInfoPtr, uint8Ptr]],

  // image_info* get_grayscale_image2(image_info *image, rect_info area);
  get_grayscale_image2: [imageInfoPtr, [imageInfoPtr, datatypes.RectInfo]],

  // void get_grayscale_image_raw2(image_info *image, rect_info area, uint8_t *gray_image);
  get_grayscale_image_raw2: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, uint8Ptr]
  ],

  /**
   *  utils/resize.h
   */
  // image_info* resize_image(image_info *image, size_info target_size);
  resize_image: [imageInfoPtr, [imageInfoPtr, datatypes.SizeInfo]],

  //image_info* resize_to_grayscale_image(image_info *image, size_info target_size, resize_type type);
  resize_to_grayscale_image: [
    imageInfoPtr,
    [imageInfoPtr, datatypes.SizeInfo, uint8]
  ],

  // void resize_to_grayscale_image_raw(image_info *image, size_info target_size, resize_type type, uint8_t *resized_image);
  resize_to_grayscale_image_raw: [
    'void',
    [imageInfoPtr, datatypes.SizeInfo, uint8, uint8Ptr]
  ],

  // image_info* resize_to_grayscale_image2(image_info *image, rect_info sub_area, size_info target_size, resize_type type);
  resize_to_grayscale_image2: [
    imageInfoPtr,
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8]
  ],

  // void resize_to_grayscale_image_raw2(image_info *image, rect_info sub_area, size_info target_size, resize_type type, uint8_t *resized_image);
  resize_to_grayscale_image_raw2: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8, uint8Ptr]
  ],

  /**
   * utils/equalize.h
   */
  // void equalize_gray_histogram(image_info *source, image_info *destination);
  equalize_gray_histogram: ['void', [imageInfoPtr, imageInfoPtr]],

  /**
   * utils/targetarea.h
   */
  // rect_info get_target_area(image_info *image, rect_info criterion_area, size_info target_area_ratio);
  get_target_area: [
    datatypes.RectInfo,
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo]
  ],

  /**
   *  blur/average.h
   */
  // void get_average_blur(image_info *image, uint8_t *result_buffer);
  get_average_blur: ['void', [imageInfoPtr, uint8Ptr]],

  // void get_average_blur_gray(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_average_blur_gray: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  // void get_average_blur_gray2(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_average_blur_gray2: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  /**
   * blur/meidan.h
   */
  // void get_median_blur(image_info *image, uint8_t *result_buffer);
  get_median_blur: ['void', [imageInfoPtr, uint8Ptr]],

  // void get_median_blur_gray(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_median_blur_gray: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  // void get_median_blur_gray2(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_median_blur_gray2: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  /**
   * blur/bilateral.h
   */
  // void get_bilateral_blur(image_info *image, uint8_t *result_buffer);
  get_bilateral_blur: ['void', [imageInfoPtr, uint8Ptr]],

  // void get_bilateral_blur_gray(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_bilateral_blur_gray: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  // void get_bilateral_blur_gray2(image_info *image, uint8_t *temp_buffer, uint8_t *result_buffer);
  get_bilateral_blur_gray2: ['void', [imageInfoPtr, uint8Ptr, uint8Ptr]],

  /**
   *  blur/gaussian.h
   */
  // void get_gaussian_blur(image_info *image, image_info *result_image);
  get_gaussian_blur: ['void', [imageInfoPtr, imageInfoPtr]],

  /**
   * edge/sobel.h - typedef 있음
   */
  // void get_sobel_edge(image_info *image, sobel_options *options, uint8_t *edge_magnitude_vector);
  get_sobel_edge: ['void', [imageInfoPtr, sobelOptionsPtr, uint8Ptr]],

  // void get_sobel_edge_with_gradient(image_info *image, sobel_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_sobel_edge_with_gradient: [
    'void',
    [imageInfoPtr, sobelOptionsPtr, uint16Ptr, uint16Ptr]
  ],

  /**
   * edge/prewitt.h - typedef 있음
   */
  // void get_prewitt_edge(image_info *image, prewitt_options *options, uint8_t *edge_magnitude_vector);
  get_prewitt_edge: ['void', [imageInfoPtr, prewittOptionsPtr, uint8Ptr]],

  // void get_prewitt_edge_with_gradient(image_info *image, prewitt_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_prewitt_edge_with_gradient: [
    'void',
    [imageInfoPtr, prewittOptionsPtr, uint16Ptr, uint16Ptr]
  ],

  /**
   * edge/roberts.h - typedef 있음
   */
  // void get_roberts_edge(image_info *image, roberts_options *options, uint8_t *edge_magnitude_vector);
  get_roberts_edge: ['void', [imageInfoPtr, robertsOptionsPtr, uint8Ptr]],

  // void get_roberts_edge_with_gradient(image_info *image, roberts_options *options, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector);
  get_roberts_edge_with_gradient: [
    'void',
    [imageInfoPtr, robertsOptionsPtr, uint16Ptr, uint16Ptr]
  ],

  /**
   * edge/canny.h - typedef 있음
   */
  // void get_canny_edge(size_info image_size, uint16_t *edge_magnitude_vector, uint16_t *edge_gradient_vector, canny_options *options, image_info *result_image);
  get_canny_edge: [
    'void',
    [datatypes.SizeInfo, uint16Ptr, uint16Ptr, cannyOptionsPtr, imageInfoPtr]
  ],

  // uint16_t calculate_canny_gradient(int16_t vertical_magnitude, int16_t horizontal_magnitude, BOOL use_math);
  calculate_canny_gradient: [uint16, [int16, int16, bool]],

  /**
   * edge/hough.h - typedef 있음
   */
  // void get_hough_edge_line(image_info *image, hough_line_options *options, list_info *edge_list);
  get_hough_edge_line: [
    'void',
    [imageInfoPtr, houghLineOptionsPtr, listInfoPtr]
  ],

  // void get_hough_edge_circle(image_info *image, hough_circle_options *options, list_info *edge_list);
  get_hough_edge_circle: [
    'void',
    [imageInfoPtr, houghCircleOptionsPtr, listInfoPtr]
  ],

  // void draw_hough_line_result(list_info *result_list, image_info *image);
  draw_hough_line_result: ['void', [imageInfoPtr, imageInfoPtr]],

  // void draw_hough_circle_result(list_info *result_list, image_info *image);
  draw_hough_circle_result: ['void', [imageInfoPtr, imageInfoPtr]],

  /**
   * feature/subsample.h - define 있음
   */
  // void get_subsample_feature(image_info *image, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_feature: ['void', [imageInfoPtr, datatypes.SizeInfo, uint8Ptr]],

  // void get_subsample_feature2(image_info *image, rect_info sub_area, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_feature2: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8Ptr]
  ],

  // void get_subsample_color_feature(image_info *image, rect_info sub_area, size_info grid_num, uint8_t *subsample_feature);
  get_subsample_color_feature: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, datatypes.SizeInfo, uint8Ptr]
  ],

  /**
   * feature/edgegap.h - define 있음
   */
  // void get_edge_gap_feature(image_info *image, size_info line_num, uint8_t *edge_gap_feature);
  get_edge_gap_feature: ['void', [imageInfoPtr, datatypes.SizeInfo, uint8Ptr]],

  /**
   * feature/hog.h - typedef 있음 / - define 있음
   */
  // void get_hog_feature(size_info image_size, uint16_t *edge_magnitude, uint16_t *edge_gradient, hog_options *options, vector_info **hog_feature);
  get_hog_feature: [
    'void',
    [datatypes.SizeInfo, uint16Ptr, uint16Ptr, hogOptionsPtr, vectorInfoPtrPtr]
  ],

  // uint16_t calculate_hog_gradient(int16_t vertical_magnitude, int16_t horizontal_magnitude, BOOL use_math);
  calculate_hog_gradient: [uint16, [int16, int16, bool]],

  /**
   * feature/lbp.h
   */
  // void get_uniform_lbp_feature(image_info *image, vector_info **uniform_lbp_feature);
  get_uniform_lbp_feature: ['void', [imageInfoPtr, vectorInfoPtrPtr]],

  /**
   * detect/haar.h - typedef 있음
   */
  // void get_haar_cascade_detect(image_info *image, rect_info sub_area, haar_options *options, list_info *result_rect_list);
  get_haar_cascade_detect: [
    'void',
    [imageInfoPtr, datatypes.RectInfo, haarOptionsPtr, listInfoPtr]
  ],

  // void draw_haar_result(image_info *image, list_info *result_rect_list);
  draw_haar_result: ['void', [imageInfoPtr, listInfoPtr]],

  /**
   * detect/track.h - typedef 있음
   */
  // BOOL track_roi(image_info *image, rect_info tracking_area, size_info min_roi, size_info stride_ratio, function_classify classify, rect_info *result_roi);
  // 20.03.27 - function_classify가 이렇게하는게 맞남
  track_roi: [
    bool,
    [
      imageInfoPtr,
      datatypes.RectInfo,
      datatypes.SizeInfo,
      datatypes.SizeInfo,
      datatypes.functionClassifyFuncPtr,
      datatypes.RectInfo
    ]
  ],

  /**
   * detect/detect.h - typedef 있음
   */
  // BOOL detect_roi(image_info *image, size_info min_roi, size_info stride_ratio, function_classify classify, rect_info *result_rect);
  detect_roi: [
    bool,
    [
      imageInfoPtr,
      datatypes.SizeInfo,
      datatypes.SizeInfo,
      datatypes.functionClassifyFuncPtr,
      rectInfoPtr
    ]
  ]
});

// exports.getAverageBlur = (data, width, height, color, bytes_per_pixel, coordinate) => {

//   let sizeInfo = new datatypes.SizeInfo();
//   sizeInfo.width = width;
//   sizeInfo.height = height;

//   let imageInfo = new datatypes.ImageInfo();
//   imageInfo.data = data;
//   imageInfo.size = sizeInfo;
//   imageInfo.color = color;
//   imageInfo.bytes_per_pixel = bytes_per_pixel;
//   imageInfo.coordinate = coordinate;

//   let imageInfoPtr = ref.alloc(imageInfo);

//   visionlib.get_average_blur();
// }

module.exports = {
  getBytesPerPixel: visionlib.get_bytes_per_pixel,
  createVector: visionlib.create_vector,
  destroyVector: visionlib.destroy_vector,
  freeVector: visionlib.freeVector,
  functionVectorFreeListData: visionlib.function_vector_free_list_data,
  createVector32: visionlib.create_vector32,
  destroyVector32: visionlib.destroy_vector32,
  freeVector32: visionlib.freeVector32,
  functionVector32FreeListData: visionlib.function_vector32_free_list_data,
  createImage: visionlib.create_image,
  createImageWithCoordinate: visionlib.create_image_with_coordinate,
  createImageFromImage: visionlib.create_image_from_image,
  destroyImage: visionlib.destroy_image,
  freeImage: visionlib.free_image,
  functionImageFreeListData: visionlib.function_image_free_list_data,
  getPixelColor: visionlib.get_pixel_color,
  setPixelColor: visionlib.set_pixel_color,
  getPixelAverageColor: visionlib.get_pixel_average_color,
  getPixelAverageGray: visionlib.get_pixel_average_gray,
  createList: visionlib.create_list,
  getNodeFromListAt: visionlib.get_node_from_list_at,
  getDataFromListHead: visionlib.get_data_from_list_head,
  getDataFromListTail: visionlib.get_data_from_list_tail,
  getDataFromListAt: visionlib.get_data_from_list_at,
  pushDataToListHead: visionlib.push_data_to_list_head,
  pushDataToListTail: visionlib.push_data_to_list_tail,
  pushDataToListAt: visionlib.push_data_to_list_at,
  popDataFromListHead: visionlib.pop_data_from_list_head,
  popDataFromListTail: visionlib.pop_data_from_list_tail,
  popDataFromListAt: visionlib.pop_data_from_list_at,
  // removeFromListHead: visionlib.remove_from_list_head,
  cropImage: visionlib.crop_image,
  cropImageRaw: visionlib.crop_image_raw,
  getGrayscaleImage: visionlib.get_grayscale_image,
  getGrayscaleImageRaw: visionlib.get_grayscale_image_raw,
  getGrayscaleImage2: visionlib.get_grayscale_image2,
  getGrayscaleImageRaw2: visionlib.get_grayscale_image_raw2,

  /**
   *  utils/resize.h
   */
  resizeImage: visionlib.resize_image,
  resizeToGrayscaleImage: visionlib.resize_to_grayscale_image,
  resizeToGrayscaleImageRaw: visionlib.resize_to_grayscale_image_raw,
  resizeToGrayscaleImage2: visionlib.resize_to_grayscale_image2,
  resizeToGrayscaleImageRaw2: visionlib.resize_to_grayscale_image_raw2,

  /**
   * utils/equalize.h
   */
  equalizeGrayHistogram: visionlib.equalize_gray_histogram,
  getTargetArea: visionlib.get_target_area,

  /**
   *  blur/average.h
   */
  getAverageBlur: visionlib.get_average_blur,
  getAverageBlurGray: visionlib.get_average_blur_gray,
  getAverageBlurGray2: visionlib.get_average_blur_gray2,

  /**
   * blur/meidan.h
   */
  getMedianBlur: visionlib.get_median_blur,
  getMedianBlurGray: visionlib.get_median_blur_gray,
  getMedianBlurGray2: visionlib.get_median_blur_gray2,

  /**
   * blur/bilateral.h
   */
  getBilateralBlur: visionlib.get_bilateral_blur,
  getBilateralBlurGray: visionlib.get_bilateral_blur_gray,
  getBilateralBlurGray2: visionlib.get_bilateral_blur_gray2,

  /**
   *  blur/gaussian.h
   */
  getGaussianBlur: visionlib.get_gaussian_blur,

  /**
   * edge/sobel.h - typedef 있음
   */
  getSobelEdge: visionlib.get_sobel_edge,
  getSobelEdgeWithGradient: visionlib.get_sobel_edge_with_gradient,

  /**
   * edge/prewitt.h - typedef 있음
   */
  getPrewittEdge: visionlib.get_prewitt_edge,
  getPrewittEdgeWithGradient: visionlib.get_prewitt_edge_with_gradient,

  /**
   * edge/roberts.h - typedef 있음
   */
  getRobertsEdge: visionlib.get_roberts_edge,
  getRobertsEdgeWithGradient: visionlib.get_roberts_edge_with_gradient,

  /**
   * edge/canny.h - typedef 있음
   */
  getCannyEdge: visionlib.get_canny_edge,
  calculateCannyGradient: visionlib.calculate_canny_gradient,

  /**
   * edge/hough.h - typedef 있음
   */
  getHoughEdgeLine: visionlib.get_hough_edge_line,
  getHoughEdgeCircle: visionlib.get_hough_edge_circle,
  drawHoughLineResult: visionlib.draw_hough_line_result,
  drawHoughCircleResult: visionlib.draw_hough_circle_result,

  /**
   * feature/subsample.h - define 있음
   */
  getSubsampleFeature: visionlib.get_subsample_feature,
  getSubsampleFeature2: visionlib.get_subsample_feature2,
  getSubsampleColorFeature: visionlib.get_subsample_color_feature,

  /**
   * feature/edgegap.h - define 있음
   */
  getEdgeGapFeature: visionlib.get_edge_gap_feature,

  /**
   * feature/hog.h - typedef 있음 / - define 있음
   */
  getHogFeature: visionlib.get_hog_feature,
  calculateHogGradient: visionlib.calculate_hog_gradient,

  /**
   * feature/lbp.h
   */
  getUniformLbpFeature: visionlib.get_uniform_lbp_feature,

  /**
   * detect/haar.h - typedef 있음
   */
  getHaarCascadeDetect: visionlib.get_haar_cascade_detect,
  drawHaarResult: visionlib.draw_haar_result,

  /**
   * detect/track.h - typedef 있음
   */
  trackRoi: visionlib.track_roi,
  detectRoi: visionlib.detect_roi
};
