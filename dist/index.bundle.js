(self["webpackChunkwebpack_master"] = self["webpackChunkwebpack_master"] || []).push([["index"],{

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/_lodash@4.17.21@lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _print__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./print */ "./src/print.js");

__webpack_require__.e(/*! import() */ "src_css_base_less").then(__webpack_require__.bind(__webpack_require__, /*! ./css/base.less */ "./src/css/base.less"))
;
function component() {
  const element = document.createElement('div')
  element.innerHTML = lodash__WEBPACK_IMPORTED_MODULE_0___default().join(['Hello', 'webpack'], ' ')
  const btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = _print__WEBPACK_IMPORTED_MODULE_1__.default
  element.appendChild(btn)
  return element
}

document.body.appendChild(component())

console.log('sfsfhahah')
console.log(123)

/***/ }),

/***/ "./src/print.js":
/*!**********************!*\
  !*** ./src/print.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ printMe; }
/* harmony export */ });
function printMe() {
  console.log('I get called from print.js!');
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./src/main.js"));
/******/ }
]);
//# sourceMappingURL=index.bundle.js.map