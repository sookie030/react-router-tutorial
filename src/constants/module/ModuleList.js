import * as GROUPS from './Groups';
import * as MODULES from './Modules';

const SOURCE_MODULE_LIST = [
    MODULES.CAMERA,
    MODULES.FACE_CAMERA,
    MODULES.FILE_LOADER,
];

const FILTER_MODULE_LIST = [
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
    MODULES.CROP
];

const DETECTOR_MODULE_LIST = [
    MODULES.FACE_DETECTOR
];

const FEATURE_MODULE_LIST = [
    MODULES.SUBSAMPLE,
    MODULES.HOG
];

const AI_MODULE_LIST = [
    MODULES.NM500,
    MODULES.DECISION_MAKER
];

const NOTIFIER_MODULE_LIST = [
    MODULES.SOUND,
    MODULES.VIBRATION,
    MODULES.DISPLAY
];

const DISPATCHER_MODULE_LIST = [
    MODULES.FILE_SAVER
];

const MODULE_LIST = {};
MODULE_LIST[GROUPS.SOURCE] = SOURCE_MODULE_LIST;
MODULE_LIST[GROUPS.FILTER] = FILTER_MODULE_LIST;
MODULE_LIST[GROUPS.DETECTOR] = DETECTOR_MODULE_LIST;
MODULE_LIST[GROUPS.FEATURE] = FEATURE_MODULE_LIST;
MODULE_LIST[GROUPS.AI] = AI_MODULE_LIST;
MODULE_LIST[GROUPS.NOTIFIER] = NOTIFIER_MODULE_LIST;
MODULE_LIST[GROUPS.DISPATCHER] = DISPATCHER_MODULE_LIST;

export default MODULE_LIST;


