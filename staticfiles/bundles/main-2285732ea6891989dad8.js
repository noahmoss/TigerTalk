/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/index.js":
/*!****************************!*\
  !*** ./assets/js/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: SyntaxError: Unexpected token (265:5)\\n\\n\\u001b[0m \\u001b[90m 263 | \\u001b[39m\\t}\\n \\u001b[90m 264 | \\u001b[39m\\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 265 | \\u001b[39m\\tlet date_string \\u001b[33m=\\u001b[39m timestamp(\\u001b[36mthis\\u001b[39m\\u001b[33m.\\u001b[39mprops\\u001b[33m.\\u001b[39mdate)\\u001b[33m;\\u001b[39m\\n \\u001b[90m     | \\u001b[39m\\t    \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 266 | \\u001b[39m\\trender() {\\n \\u001b[90m 267 | \\u001b[39m\\t\\t\\u001b[36mreturn\\u001b[39m (\\n \\u001b[90m 268 | \\u001b[39m\\t\\t\\t\\t\\u001b[33m<\\u001b[39m\\u001b[33mdiv\\u001b[39m className\\u001b[33m=\\u001b[39m\\u001b[32m\\\"replyContainer\\\"\\u001b[39m\\u001b[33m>\\u001b[39m\\u001b[0m\\n\");\n\n//# sourceURL=webpack:///./assets/js/index.js?");

/***/ })

/******/ });