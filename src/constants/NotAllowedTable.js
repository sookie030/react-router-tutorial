import * as MODULE_MANAGER from './ModuleInfo';

const NOT_ALLOW_LIST_FD = [
    'Face Camera'
];

// Canny -> Sobel은 가능
// Sobel -> Canny는 불가능
const NOT_ALLOW_LIST_CANNY = [
    'Edge Sobel',
    'Edge Prewitt',
    'Edge Roberts'
];

const NOT_ALLOW_LIST_HOUGH = [
    'Edge Sobel',
    'Edge Prewitt',
    'Edge Roberts'
];

const NOT_ALLOW_LIST_HOG = [
    'Edge Sobel',
    'Edge Prewitt',
    'Edge Roberts'
];

const NOT_ALLOW_LIST_ROI = [
    'Edge Hough'
];

const NOT_ALLOW_LIST_FILTER = MODULE_MANAGER.MODULE_LIST['Feature'].concat(MODULE_MANAGER.MODULE_LIST['AI']);

const NOT_ALLOW_LIST_DETECTOR = MODULE_MANAGER.MODULE_LIST['Feature'].concat(MODULE_MANAGER.MODULE_LIST['AI']);

const NOT_ALLOW_LIST_FEATURE = MODULE_MANAGER.MODULE_LIST['AI'];

var TABLE = {};
TABLE['Face Detector'] = NOT_ALLOW_LIST_FD;
TABLE['Edge Canny'] = NOT_ALLOW_LIST_CANNY;
TABLE['Edge Hough'] = NOT_ALLOW_LIST_HOUGH;
TABLE['HOG'] = NOT_ALLOW_LIST_HOG;
TABLE['Region Of Interest'] = NOT_ALLOW_LIST_ROI;


MODULE_MANAGER.MODULE_LIST['Filter'].forEach(m => {
    if (TABLE[m] !== null)
        TABLE[m] = NOT_ALLOW_LIST_FILTER.concat(TABLE[m]);
    else
        TABLE[m] = NOT_ALLOW_LIST_FILTER;

})

MODULE_MANAGER.MODULE_LIST['Detector'].forEach(m => {
    if (TABLE[m] !== null)
        TABLE[m] = NOT_ALLOW_LIST_DETECTOR.concat(TABLE[m]);
    else
        TABLE[m] = NOT_ALLOW_LIST_DETECTOR;
})

MODULE_MANAGER.MODULE_LIST['Feature'].forEach(m => {
    if (TABLE[m] !== null)
        TABLE[m] = NOT_ALLOW_LIST_FEATURE.concat(TABLE[m]);
    else
        TABLE[m] = NOT_ALLOW_LIST_FEATURE;
})

export default TABLE;