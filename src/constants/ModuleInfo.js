/**
 * Module Name
 */
const MODULES = {
  // Source
  CAMERA: "Camera",
  FACE_CAMERA: "Face Camera",
  FILE_LOADER: "File Loader",
  MIC: "Microphone",

  // Filter
  ROI: "Region Of Interest",
  BLUR_AVERAGE: "Blur Average",
  BLUR_MEDIAN: "Blur Median",
  BLUR_BIATERAL: "Blur Biateral",
  EDGE_SOBEL: "Edge Sobel",
  EDGE_PREWITT: "Edge Prewitt",
  EDGE_ROBERTS: "Edge Roberts",
  EDGE_CANNY: "Edge Canny",
  EDGE_HOUGH: "Edge Hough",
  GRAYSCALE: "Grayscale",
  RESIZE: "Resize",
  CROP: "Crop",
  GRID: "Grid",

  // Detector
  FACE_DETECTOR: "Face Detector",

  // Feature
  SUBSAMPLE: "Subsample",
  HOG: "HOG",
  LBP: "LBP",

  // AI
  NM500: "NM500",
  DECISION_MAKER: "Decision Maker",
  SCANNER: "Scanner",

  // Notifier
  SOUND: "Sound",
  VIBRATION: "Vibration",
  DISPLAY: "Display",
  GRID_MAKER: "Grid Maker",

  // dispatcher
  FILE_SAVER: "File Saver",
};

/**
 * Group Name
 */
const GROUPS = {
  SOURCE: "Source",
  FILTER: "Filter",
  DETECTOR: "Detector",
  FEATURE: "Feature",
  AI: "AI",
  NOTIFIER: "Notifier",
  DISPATCHER: "Dispatcher",
};

/**
 * Module list in each group
 */
const MODULE_LIST = {};

MODULE_LIST[GROUPS.SOURCE] = [
  MODULES.CAMERA,
  MODULES.FACE_CAMERA,
  MODULES.FILE_LOADER,
  // MODULES.MIC
];

MODULE_LIST[GROUPS.FILTER] = [
  MODULES.ROI,
  MODULES.BLUR_AVERAGE,
  MODULES.BLUR_MEDIAN,
  MODULES.BLUR_BIATERAL,
  MODULES.EDGE_SOBEL,
  MODULES.EDGE_PREWITT,
  MODULES.EDGE_ROBERTS,
  MODULES.EDGE_CANNY,
  MODULES.EDGE_HOUGH,
  MODULES.GRAYSCALE,
  MODULES.RESIZE,
  MODULES.CROP,
  // MODULES.GRID
];

// MODULE_LIST[GROUPS.DETECTOR] = [MODULES.FACE_DETECTOR];

MODULE_LIST[GROUPS.FEATURE] = [MODULES.SUBSAMPLE, MODULES.HOG, MODULES.LBP];

MODULE_LIST[GROUPS.AI] = [
  MODULES.NM500,
  MODULES.DECISION_MAKER,
  MODULES.SCANNER,
];

// MODULE_LIST[GROUPS.NOTIFIER] = [
//   MODULES.SOUND,
//   MODULES.VIBRATION,
//   MODULES.DISPLAY,
//   MODULES.GRID_MAKER
// ];

MODULE_LIST[GROUPS.DISPATCHER] = [MODULES.FILE_SAVER];

/**
 * Module Description
 */
const DESC = {};

// Source
// DESC[MODULES.CAMERA] = "Camera";
DESC[MODULES.CAMERA] = {
  short: "Camera",
  long: "Camera orientation (rear / front), to change the camera orientation.",
};
DESC[MODULES.FACE_CAMERA] = { short: "Face Camera", long: "" };
DESC[MODULES.FILE_LOADER] = { short: "File Loader", long: "" };
DESC[MODULES.MIC] = { short: "Microphone", long: "" };

// Filter
DESC[MODULES.ROI] = { short: "Region Of Interest", long: "" };
DESC[MODULES.BLUR_AVERAGE] = { short: "Blur Average", long: "" };
DESC[MODULES.BLUR_MEDIAN] = { short: "Blur Median", long: "" };
DESC[MODULES.BLUR_BIATERAL] = { short: "Blur Biateral", long: "" };
DESC[MODULES.EDGE_SOBEL] = { short: "Edge Sobel", long: "" };
DESC[MODULES.EDGE_PREWITT] = { short: "Edge Prewitt", long: "" };
DESC[MODULES.EDGE_ROBERTS] = { short: "Edge Roberts", long: "" };
DESC[MODULES.EDGE_CANNY] = { short: "Edge Canny", long: "" };
DESC[MODULES.EDGE_HOUGH] = { short: "Edge Hough", long: "" };
DESC[MODULES.GRAYSCALE] = { short: "Grayscale", long: "" };
DESC[MODULES.RESIZE] = { short: "Resize", long: "" };
DESC[MODULES.CROP] = { short: "Crop", long: "" };
DESC[MODULES.GRID] = { short: "Grid", long: "" };

// Detector
DESC[MODULES.FACE_DETECTOR] = { short: "Face Detector", long: "" };

// Feature
DESC[MODULES.SUBSAMPLE] = { short: "Subsample", long: "" };
DESC[MODULES.HOG] = { short: "HOG", long: "" };
DESC[MODULES.LBP] = { short: "LBP", long: "" };

// AI
DESC[MODULES.NM500] = { short: "NM500", long: "" };
DESC[MODULES.DECISION_MAKER] = { short: "Decision Maker", long: "" };
DESC[MODULES.SCANNER] = { short: "Scanner", long: "" };

// Notifier
DESC[MODULES.SOUND] = { short: "Sound", long: "" };
DESC[MODULES.VIBRATION] = { short: "Vibration", long: "" };
DESC[MODULES.DISPLAY] = { short: "Display", long: "" };
DESC[MODULES.GRID_MAKER] = { short: "Grid Maker", long: "" };

// dispatcher
DESC[MODULES.FILE_SAVER] = { short: "File Saver", long: "" };

export { MODULES, GROUPS, MODULE_LIST, DESC };
