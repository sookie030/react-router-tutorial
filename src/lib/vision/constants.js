module.exports = Object.freeze({

  /***********************************************************
   * subsample.h, edgegap.h
   ***********************************************************/
  MAX_VECTOR_LENGTH: 256,
  DEFAULT_FEATURE_NUM_PER_LINE: 16,

  /***********************************************************
   * hog.h
   ***********************************************************/
  // each 40 degrees
  DEFAULT_HISTOGRAM_BIN_NUM: 9,

  // 8x8 pixels
  DEFAULT_PIXEL_NUM_PER_CELL: 8,

  // 2x2 cells
  DEFAULT_CELL_NUM_PER_BLOCK: 2,

  // 1 cell
  DEFAULT_PIXEL_NUM_FOR_STRIDE: 8,

  /***********************************************************
   * lbp.h
   ***********************************************************/
  UNIFORM_LBP_BLOCK_SIZE: 16,
  
  UNIFORM_LBP_BIN: 59,

  /***********************************************************
   * define.h
   ***********************************************************/

  /**
   * #define
   */
  LITTLE_ENDIAN: 1,

  /**
   * color_format
   */
  COLOR_FORMAT: {
    // 1byte Gray (8bit Gray)
    COLOR_GRAY: 0,

    // 2byte RGB (5bit Red, 6bit Green, 5bit Red)
    COLOR_RGB_565: 1,

    // 3byte RGB (8bit Blue, 8bit Green, 8bit Red)
    COLOR_RGB_888: 2,
  },

  /**
   * coordinate_type
   */
  COORDINATE_TYPE: {
    // Left-top
    COORDINATE_LEFT_TOP: 0,

    // Left-bottom
    COORDINATE_LEFT_BOTTOM: 1,

    // Right-top
    COORDINATE_RIGHT_TOP: 2,

    // Right-bottom
    COORDINATE_RIGHT_BOTTOM: 3,
  },

  /**
   * Kind of resize calculation
   */
  RESIZE_TYPE: {
    // average of area
    RESIZE_AVERAGE: 0,
    // center position of area
    RESIZE_HOP: 1,
  },

  /**
   * Kind of blur algorithm
   */
  BLUR_TYPE: {
    // None
    BLUR_NONE: 0,
    // Average blur
    BLUR_AVERAGE: 1,
    // Median blur
    BLUR_MEDIAN: 2,
    // Bilateral blur
    BLUR_BILATERAL: 3,
    // Gaussian blur
    BLUR_GAUSSIAN: 4,
  },

  /**
   * Kind of edge algorithm
   */
  EDGE_TYPE: {
    // Sobel edge
    EDGE_SOBEL: 0,
    // Prewitt edge
    EDGE_PREWITT: 1,
    // Roberts edge
    EDGE_ROBERTS: 2,
  },
});
