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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const QUICK = "quick";
/* harmony export (immutable) */ __webpack_exports__["c"] = QUICK;

const SLOW = "slow";
/* harmony export (immutable) */ __webpack_exports__["d"] = SLOW;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["f"] = VALUE;

const HOME = "/inject/home";
/* harmony export (immutable) */ __webpack_exports__["a"] = HOME;

const MONKEY = "/inject/monkey";
/* harmony export (immutable) */ __webpack_exports__["b"] = MONKEY;

const TRANSACTION = "/background/transaction";
/* harmony export (immutable) */ __webpack_exports__["e"] = TRANSACTION;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Next(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let handlers = ctx.handlers;
        let n = ctx.handlerIndex(-1) + 1;
        if (n < handlers.length) {
            ctx.handlerIndex(n);
            yield handlers[n](ctx);
        }
    });
}
class Context {
    constructor(handlers = [], values = {}, currentHandlerIndex = 0) {
        this.handlers = handlers;
        this.values = values;
        this.currentHandlerIndex = currentHandlerIndex;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Next(this);
        });
    }
    handlerIndex(n) {
        if (n < 0 || n > this.handlers.length - 1) {
            return this.currentHandlerIndex;
        }
        return this.currentHandlerIndex = n;
    }
}
/* unused harmony export Context */

class Route {
    constructor(handlers = []) {
        this.handlers = handlers;
    }
    join(...handlers) {
        this.handlers.push(...handlers);
    }
}
/* unused harmony export Route */

class Router {
    constructor(middleware = [], routes = {}) {
        this.middleware = middleware;
        this.routes = routes;
    }
    use(...handlers) {
        this.middleware.push(...handlers);
    }
    handle(key, ...handlers) {
        if (this.routes[key] == null) {
            this.routes[key] = new Route([...handlers]);
        }
        this.routes[key].join(...handlers);
    }
    serve(key, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let route = this.routes[key];
            if (route == null) {
                return;
            }
            ctx.handlers = [...this.middleware, ...route.handlers];
            yield Next(ctx);
        });
    }
    run() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let context = new Context();
            context.request = request;
            context.sender = sender;
            context.response = {};
            this.serve(request.path, context).
                catch(function (err) {
                console.log(err);
                sendResponse(context.response);
            }).then(function () {
                sendResponse(context.response);
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;



/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_ts__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__consts_ts__ = __webpack_require__(0);




const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

const router = new __WEBPACK_IMPORTED_MODULE_0__router_ts__["a" /* Router */]();
router.use(ctx => {
    console.log("页面发生变化");
    ctx.next();
});

// monkeys
router.handle(__WEBPACK_IMPORTED_MODULE_1__consts_ts__["a" /* HOME */], ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(MONKEYS)) {
                element$.find(".panel").forEach(monkey => {
                    let btns = [];

                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最大次数喂养</button>'),
                        mode: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["d" /* SLOW */]
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最少次数喂养</button>'),
                        mode: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["c" /* QUICK */]
                    });
                    console.log(monkey);
                    let elementMonkey = $(monkey);
                    let percent = elementMonkey.find(".percent").first().text();
                    let doFeed = function (self, mode) {
                        GetWhiteList().then(whitelist => {
                            let prompt = "喂养一只猴子需要向作者转账0.5WKC请确认";
                            let reward = true;
                            let {address} = JSON.parse(ctx.request.wallet);
                            if (whitelist.indexOf(`0x${address}`) !== -1) {
                                prompt = "请确定喂养";
                                reward = false;
                            }
                            if (!confirmed) {
                                if (!confirm(prompt)) {
                                    return
                                }
                                confirmed = true
                            }
                            btns.forEach(btn => {
                                btn.button.hide()
                            });
                            chrome.runtime.sendMessage({
                                path: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["e" /* TRANSACTION */],
                                id: elementMonkey.find(".id").first().text().split(' ')[1],
                                limit: Number((percent.split('/')[1] - percent.split('/')[0]).toFixed(2)),
                                mode: mode,
                                reward: reward,
                            }, function (response) {
                                console.log(response);
                            });
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
            }
        });
        resolve();
    });
});
//items
router.handle(__WEBPACK_IMPORTED_MODULE_1__consts_ts__["b" /* MONKEY */], ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(ITEM)) {
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
                let showMark = request.mode === __WEBPACK_IMPORTED_MODULE_1__consts_ts__["f" /* VALUE */] ? mark : mark / wkc;
                span.text(wkc + ";" + (showMark).toFixed(5));
                if (showMark >= request.min) {
                    element$.prop("style", "background:#F00;")
                }
            }
        });
        resolve();
    });
});

router.run();

const GetWhiteList = function () {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp)
        })
    })
};

/***/ })
/******/ ]);
//# sourceMappingURL=inject.js.map