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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const QUICK = "quick";
/* harmony export (immutable) */ __webpack_exports__["a"] = QUICK;

const SLOW = "slow";
/* harmony export (immutable) */ __webpack_exports__["b"] = SLOW;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["c"] = VALUE;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_ts__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__router_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modes__ = __webpack_require__(0);



const ELEMENT = "element$";
const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

let router = new __WEBPACK_IMPORTED_MODULE_0__router_ts__["Router"]();
// monkeys
router.handle(`/${MONKEYS}`, ctx => {
    let element$ = ctx.values[ELEMENT];
    element$.find(".panel").forEach(monkey => {
        let btns = [];
        btns.push({
            button: $('<button style="margin:1px;border-color:red;">最大次数喂养</button>'),
            mode: __WEBPACK_IMPORTED_MODULE_1__modes__["b" /* SLOW */]
        });
        btns.push({
            button: $('<button style="margin:1px;border-color:red;">最少次数喂养</button>'),
            mode: __WEBPACK_IMPORTED_MODULE_1__modes__["a" /* QUICK */]
        });
        console.log(monkey);
        let elementMonkey = $(monkey);
        let percent = elementMonkey.find(".percent").first().text();
        let doFeed = function (self, mode) {
            if (!confirmed) {
                if (!confirm("喂养一只猴子需要向作者转账0.5WKC请确认")) {
                    return
                }
                confirmed = true
            }
            btns.forEach(btn => {
                btn.button.hide()
            });
            chrome.runtime.sendMessage({
                id: elementMonkey.find(".id").first().text().split(' ')[1],
                limit: Number((percent.split('/')[1] - percent.split('/')[0]).toFixed(2)),
                mode: mode,
            }, function (response) {
                console.log(response);
            });
        };
        btns.forEach(btn => {
            btn.button.click(function () {
                doFeed($(this), btn.mode);
            });
        });
        console.log("has button", elementMonkey.has("button").length);
        if (elementMonkey.find("button").length === 0) {
            btns.forEach(btn => {
                elementMonkey.append(btn.button);
            });
        }
    })
});
//items
router.handle(`/${ITEM}`, ctx => {
    let element$ = ctx.values[ELEMENT];
    let info = $(element$.find(".info p").get(1)).text();
    let priceDiv = element$.find(".price span").first();
    let price = $(element$.find(".price span").get(0)).text();
    if (!info || !priceDiv || !price) {
        return
    }
    let kg = info.split('·')[1].split(' ')[0];
    let arg1 = info.split('·')[0].split('/')[0];
    let arg2 = info.split('·')[0].split('/')[1];
    let arg3 = info.split('·')[0].split('/')[2];
    let wkc = price.split(' ')[0];
    let span = $(element$.find(".price").find(".price span").get(0));
    if (span.text().indexOf(";") !== -1) {
        wkc = span.text().split(';')[0]
    }
    let request = ctx.request;
    console.log(request.mode, request.min);
    let mark = arg1 * arg3 * (request.kg === "true" ? kg : 1);
    let showMark = request.mode === __WEBPACK_IMPORTED_MODULE_1__modes__["c" /* VALUE */] ? mark : mark / wkc;
    span.text(wkc + ";" + (showMark).toFixed(5));
    if (showMark >= request.min) {
        element$.prop("style", "background:#F00;")
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("页面发生变化");
        setTimeout(function () {
            $("div").forEach(element => {
                let element$ = $(element);

                if (element$.hasClass(MONKEYS)) {
                    let context = new __WEBPACK_IMPORTED_MODULE_0__router_ts__["Context"]();
                    context.request = request;
                    context.sender = sender;
                    context.sendResponse = sendResponse;
                    context.values[ELEMENT] = element$;
                    router.serve(`/${MONKEYS}`, context)
                }
                if (element$.hasClass(ITEM)) {
                    let context = new __WEBPACK_IMPORTED_MODULE_0__router_ts__["Context"]();
                    context.request = request;
                    context.sender = sender;
                    context.sendResponse = sendResponse;
                    context.values[ELEMENT] = element$;
                    router.serve(`/${ITEM}`, context);
                }
            });
        }, 1000);
        sendResponse({})
    }
);



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Next(ctx) {
    var handlers = ctx.handlers;
    var n = ctx.handlerIndex(-1) + 1;
    if (n < handlers.length) {
        ctx.handlerIndex(n);
        handlers[n](ctx);
    }
}
var Context = /** @class */ (function () {
    function Context(handlers, values, currentHandlerIndex) {
        if (handlers === void 0) { handlers = []; }
        if (values === void 0) { values = {}; }
        if (currentHandlerIndex === void 0) { currentHandlerIndex = 0; }
        this.handlers = handlers;
        this.values = values;
        this.currentHandlerIndex = currentHandlerIndex;
    }
    Context.prototype.next = function () {
        Next(this);
    };
    Context.prototype.handlerIndex = function (n) {
        if (n < 0 || n > this.handlers.length - 1) {
            return this.currentHandlerIndex;
        }
        return this.currentHandlerIndex = n;
    };
    return Context;
}());
exports.Context = Context;
var Route = /** @class */ (function () {
    function Route(handlers) {
        if (handlers === void 0) { handlers = []; }
        this.handlers = handlers;
    }
    Route.prototype.join = function () {
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        (_a = this.handlers).push.apply(_a, handlers);
        var _a;
    };
    return Route;
}());
exports.Route = Route;
var Router = /** @class */ (function () {
    function Router(m) {
        if (m === void 0) { m = {}; }
        this.m = m;
    }
    Router.prototype.handle = function (key) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        if (this.m[key] == null) {
            this.m[key] = new Route(handlers.slice());
        }
        (_a = this.m[key]).join.apply(_a, handlers);
        var _a;
    };
    Router.prototype.serve = function (key, ctx) {
        var route = this.m[key];
        if (route == null) {
            return;
        }
        ctx.handlers = route.handlers;
        Next(ctx);
    };
    Router.prototype.run = function () {
    };
    return Router;
}());
exports.Router = Router;


/***/ })
/******/ ]);
//# sourceMappingURL=inject.js.map