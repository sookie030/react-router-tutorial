window.fs = require("fs");
window.electron = require("electron");
window.dialog = require("electron").remote.dialog;
window.app = require("electron").remote.app;
window.nativeImage = require("electron").nativeImage;
window.electronIsDev = require("electron-is-dev");

window.arch = process.arch;
window.env = process.env;
window.platform = process.platform;

window.ffi = require("ffi-napi");
window.ref = require("ref-napi");
window.ArrayType = require("ref-array-di")(window.ref);
window.StructType = require("ref-struct-di")(window.ref);

