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
/******/ 	return __webpack_require__(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ({

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_ts__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__consts_ts__ = __webpack_require__(23);



const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

const router = new __WEBPACK_IMPORTED_MODULE_0__router_ts__["a" /* Router */]();
router.use(ctx => {
    console.log("页面发生变化");
    ctx.next();
});

const generationFactor = (() => {
    const generationFactorDict = {};
    return (n) => {
        if (generationFactorDict[n] === undefined) {
            generationFactorDict[n] = 1.168 ** Number(n)
        }
        return generationFactorDict[n];
    }
})();

router.handle(__WEBPACK_IMPORTED_MODULE_1__consts_ts__["a" /* ALERT */], ctx => {
    return new Promise((resolve, reject) => {
        alert(ctx.request.alert);
        resolve();
    });
});

// monkeys
router.handle(__WEBPACK_IMPORTED_MODULE_1__consts_ts__["c" /* HOME */], ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(MONKEYS)) {
                // 掘金分数
                element$.find(".panel").forEach(monkey => {
                    let elementMonkey = $(monkey);
                    ShowScore(elementMonkey);

                    let btns = [];

                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最接近饱喂养</button>'),
                        mode: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["b" /* FULL */]
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最大次数喂养</button>'),
                        mode: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["g" /* SLOW */]
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最少次数喂养</button>'),
                        mode: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["e" /* QUICK */]
                    });
                    let percent = elementMonkey.find(".percent").first().text();
                    let doFeed = function (self, mode) {
                        let promptInfo = "请确定喂养";
                        if (!confirmed) {
                            if (!confirm(promptInfo)) {
                                return
                            }
                            confirmed = true
                        }
                        btns.forEach(btn => {
                            btn.button.hide()
                        });
                        chrome.runtime.sendMessage({
                            path: __WEBPACK_IMPORTED_MODULE_1__consts_ts__["h" /* TRANSACTION */],
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
//market
router.handle(__WEBPACK_IMPORTED_MODULE_1__consts_ts__["d" /* MARKET */], ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(ITEM)) {
                let info = $(element$.find(".info p").get(1)).text();
                let priceDiv = element$.find(".price span").first();
                let price = $(element$.find(".price span").get(0)).text();
                let gen = element$.find(".gen").text().replace("代", "");
                if (!info || !priceDiv || !price || !gen) {
                    return
                }
                let weight = info.split('•')[1].split(' ')[0].replace("kg", "");
                let digValue = info.split('•')[0].split('/')[1];
                let wkc = price.split(' ')[0];
                let span = $(element$.find(".price").find(".price span").get(0));
                if (span.text().indexOf(";") !== -1) {
                    wkc = span.text().split(';')[0]
                }
                let request = ctx.request;
                let mark = Number(digValue) * (request.kg === "true" ? Number(weight) : 1) / generationFactor(gen);
                let showMark = request.mode === __WEBPACK_IMPORTED_MODULE_1__consts_ts__["i" /* VALUE */] ? mark : mark / Number(wkc);
                span.text(`${wkc} 掘金价值:${(showMark).toFixed(5)}`);
                if (showMark >= request.min) {
                    element$.prop("style", "background:rgb(201,199,157);")
                }
            }
        });
        resolve();
    });
});

router.run();

const ShowScore = function (element$) {
    const lis = element$.find(".minfo li");
    if (lis.length === 0) {
        return
    }
    const rowOne = $(lis[0]);
    const showPosition = rowOne.text();
    if (showPosition.indexOf("掘金分数") !== -1) {
        return
    }
    let words = /(\d+) .*?([\d.]+)/.exec(showPosition);
    if (words === null) {
        console.log("匹配不到 代数 和 体重");
        return
    }
    const ps = element$.find(".info p");
    if (ps.length < 2) {
        console.log("找不到猴子 属性");
        return
    }
    const params = ps.text().split("/");
    if (params.length < 2) {
        console.log("猴子属性拆分错误");
        return
    }
    const percents = element$.find(".percent").text().split("/");
    if (percents.length < 2) {
        console.log("找不到投食进度");
        return
    }
    const weight = words[2];
    const generation = words[1];
    const digValue = params[1];
    const feeding = percents[0];
    const score = Number(weight) * Number(digValue) * Number(feeding) / generationFactor(generation);
    rowOne.text(`${showPosition} 掘金分数${score === 0 ? 0 : score.toFixed(5)}`);
};

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const QUICK = "quick";
/* harmony export (immutable) */ __webpack_exports__["e"] = QUICK;

const SLOW = "slow";
/* harmony export (immutable) */ __webpack_exports__["g"] = SLOW;

const FULL = "full";
/* harmony export (immutable) */ __webpack_exports__["b"] = FULL;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["i"] = VALUE;

const HOME = "/inject/home";
/* harmony export (immutable) */ __webpack_exports__["c"] = HOME;

const MARKET = "/inject/market";
/* harmony export (immutable) */ __webpack_exports__["d"] = MARKET;

const ALERT = "/inject/alert";
/* harmony export (immutable) */ __webpack_exports__["a"] = ALERT;

const TRANSACTION = "/background/transaction";
/* harmony export (immutable) */ __webpack_exports__["h"] = TRANSACTION;

const REWARD = "/background/reward";
/* harmony export (immutable) */ __webpack_exports__["f"] = REWARD;



/***/ }),

/***/ 37:
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
            try {
                yield handlers[n](ctx);
            }
            catch (err) {
                throw err;
            }
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
            try {
                yield Next(this);
            }
            catch (err) {
                throw err;
            }
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
            try {
                yield Next(ctx);
            }
            catch (err) {
                throw err;
            }
        });
    }
    run() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let context = new Context();
            context.request = request;
            context.sender = sender;
            context.response = {};
            this.serve(request.path, context).catch(function (err) {
                sendResponse(context.response);
                throw err;
            }).then(function () {
                sendResponse(context.response);
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;



/***/ })

/******/ });