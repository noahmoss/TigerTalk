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

eval("throw new Error(\"Module build failed: SyntaxError: Expected corresponding JSX closing tag for <p> (1844:123)\\n\\n\\u001b[0m \\u001b[90m 1842 | \\u001b[39m\\t\\t\\t\\t\\t    \\u001b[33mTigerTalk\\u001b[39m is semi\\u001b[33m-\\u001b[39manonymous\\u001b[33m:\\u001b[39m your posts and comments are recorded \\u001b[36min\\u001b[39m our database \\u001b[36mwith\\u001b[39m your netID\\u001b[33m,\\u001b[39m but \\u001b[36mthis\\u001b[39m is stored securely and is never available to other users\\u001b[33m.\\u001b[39m \\n \\u001b[90m 1843 | \\u001b[39m\\t\\t\\t\\t\\t    \\u001b[33mWe\\u001b[39m will never access \\u001b[36mthis\\u001b[39m information unless a user threatens violence\\u001b[33m,\\u001b[39m reveals sensitive information about other students\\u001b[33m,\\u001b[39m or otherwise violates \\u001b[33mUniversity\\u001b[39m policies\\u001b[33m.\\u001b[39m \\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 1844 | \\u001b[39m\\t\\t\\t\\t\\t    \\u001b[33mFeel\\u001b[39m free to reach out to a member of our team \\u001b[36mif\\u001b[39m you have any questions or concerns\\u001b[33m!\\u001b[39m \\u001b[33mWe\\u001b[39m hope you enjoy the site\\u001b[33m!\\u001b[39m\\u001b[33m.\\u001b[39m\\u001b[33m<\\u001b[39m\\u001b[33m/\\u001b[39m\\u001b[33mModal\\u001b[39m\\u001b[33m.\\u001b[39m\\u001b[33mBody\\u001b[39m\\u001b[33m>\\u001b[39m\\n \\u001b[90m      | \\u001b[39m\\t\\t\\t\\t\\t                                                                                                                      \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 1845 | \\u001b[39m\\t\\t\\t\\t\\t    \\u001b[33m<\\u001b[39m\\u001b[33m/\\u001b[39m\\u001b[33mp\\u001b[39m\\u001b[33m>\\u001b[39m\\n \\u001b[90m 1846 | \\u001b[39m\\t\\t\\t\\t    \\u001b[33m<\\u001b[39m\\u001b[33mModal\\u001b[39m\\u001b[33m.\\u001b[39m\\u001b[33mFooter\\u001b[39m\\u001b[33m>\\u001b[39m\\n \\u001b[90m 1847 | \\u001b[39m\\t\\t\\t\\t      \\u001b[33m<\\u001b[39m\\u001b[33mButton\\u001b[39m onClick\\u001b[33m=\\u001b[39m{\\u001b[36mthis\\u001b[39m\\u001b[33m.\\u001b[39mhandleClose}\\u001b[33m>\\u001b[39m\\u001b[33mClose\\u001b[39m\\u001b[33m<\\u001b[39m\\u001b[33m/\\u001b[39m\\u001b[33mButton\\u001b[39m\\u001b[33m>\\u001b[39m\\u001b[0m\\n\");\n\n//# sourceURL=webpack:///./assets/js/index.js?");

/***/ })

/******/ });