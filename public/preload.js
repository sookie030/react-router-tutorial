window.fs = require("fs");
window.electron = require("electron");
window.dialog = require("electron").remote.dialog;
window.nativeImage = require("electron").nativeImage;

window.ffi = require("ffi-napi");
window.ref = require("ref-napi");
window.ArrayType = require("ref-array-di")(window.ref);
window.StructType = require("ref-struct-di")(window.ref);

