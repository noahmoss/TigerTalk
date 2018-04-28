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

eval("throw new Error(\"Module build failed: SyntaxError: Unexpected token, expected , (705:3)\\n\\n\\u001b[0m \\u001b[90m 703 | \\u001b[39m\\t\\t\\tmorePosts\\u001b[33m:\\u001b[39m \\u001b[36mtrue\\u001b[39m\\u001b[33m,\\u001b[39m \\u001b[90m// are there more posts to load?\\u001b[39m\\n \\u001b[90m 704 | \\u001b[39m\\t\\t\\tposturl\\u001b[33m:\\u001b[39m \\u001b[32m\\\"/api/posts/\\\"\\u001b[39m\\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 705 | \\u001b[39m\\t\\t\\tposts\\u001b[33m:\\u001b[39m []\\u001b[33m,\\u001b[39m \\u001b[90m// all post objects\\u001b[39m\\n \\u001b[90m     | \\u001b[39m\\t\\t\\t\\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 706 | \\u001b[39m\\t\\t\\tmy_posts\\u001b[33m:\\u001b[39m []\\u001b[33m,\\u001b[39m \\u001b[90m// post ids of user's posts\\u001b[39m\\n \\u001b[90m 707 | \\u001b[39m\\t\\t\\tmy_upvoted\\u001b[33m:\\u001b[39m []\\u001b[33m,\\u001b[39m \\u001b[90m// post ids of user's upvoted posts\\u001b[39m\\n \\u001b[90m 708 | \\u001b[39m\\t\\t\\tmy_downvoted\\u001b[33m:\\u001b[39m []\\u001b[33m,\\u001b[39m \\u001b[90m// post ids of user's downvoted posts\\u001b[39m\\u001b[0m\\n\");\n\n//# sourceURL=webpack:///./assets/js/index.js?");

/***/ })

/******/ });