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
  FILE_SAVER: "File Saver"
};

const GROUPS = {
  SOURCE: "Source",
  FILTER: "Filter",
  DETECTOR: "Detector",
  FEATURE: "Feature",
  AI: "AI",
  NOTIFIER: "Notifier",
  DISPATCHER: "Dispatcher"
};

const MODULE_LIST = {};

MODULE_LIST[GROUPS.SOURCE] = [
  MODULES.CAMERA,
  MODULES.FACE_CAMERA,
  MODULES.FILE_LOADER
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

MODULE_LIST[GROUPS.AI] = [MODULES.NM500, MODULES.DECISION_MAKER, MODULES.SCANNER];

// MODULE_LIST[GROUPS.NOTIFIER] = [
//   MODULES.SOUND,
//   MODULES.VIBRATION,
//   MODULES.DISPLAY,
//   MODULES.GRID_MAKER
// ];

MODULE_LIST[GROUPS.DISPATCHER] = [MODULES.FILE_SAVER];

export { MODULES, GROUPS, MODULE_LIST };
