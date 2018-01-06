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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ({

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(23);


const interval = 'interval';
const mode = 'mode';
const min = 'min';
const kg = 'kg';
const wallet = 'wallet';
const to_address = 'to_address';
const password = 'password';

chrome.storage.sync.get({
    [mode]: __WEBPACK_IMPORTED_MODULE_0__consts__["g" /* VALUE */],
    [min]: 0.1,
    [kg]: false,
    [interval]: 5,
    [wallet]: null,
    [to_address]: null,
    [password]: null,
}, function (result) {
    $("#mode").val(result.mode);
    $("#min").val(result.min);
    $("#kg").val(result.kg);
    $("#interval").val(result.interval);
    $("#wallet").val(result.wallet);
    $("#to_address").val(result.to_address);
    $("#password").val(result.password);
});

const DoUpdate = () => {
    console.log("update");
    chrome.storage.sync.set({
        [interval]: $('#interval').val(),
        [mode]: $("#mode").val(),
        [min]: $("#min").val(),
        [kg]: $("#kg").val(),
        [wallet]: $("#wallet").val(),
        [to_address]: $("#to_address").val(),
        [password]: $("#password").val(),
    }, function (result) {
        console.log(result)
    })
};

$("input").change(DoUpdate);
$("#update").click(DoUpdate);
$("#like").click(function () {
    DoUpdate();
    chrome.runtime.sendMessage({
        to_address: "0x1889aea32bebda482440393d470246561a4e6ca6"
    }, function (response) {
        console.log(response);
    });
});

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const QUICK = "quick";
/* harmony export (immutable) */ __webpack_exports__["d"] = QUICK;

const SLOW = "slow";
/* harmony export (immutable) */ __webpack_exports__["e"] = SLOW;

const FULL = "full";
/* harmony export (immutable) */ __webpack_exports__["a"] = FULL;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["g"] = VALUE;

const HOME = "/inject/home";
/* harmony export (immutable) */ __webpack_exports__["b"] = HOME;

const MARKET = "/inject/market";
/* harmony export (immutable) */ __webpack_exports__["c"] = MARKET;

const TRANSACTION = "/background/transaction";
/* harmony export (immutable) */ __webpack_exports__["f"] = TRANSACTION;



/***/ })

/******/ });