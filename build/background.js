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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(5);




console.log("background");

const web3 = new Web3();
const transactions = [];

function sleep() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "interval": 5,
        }, function (result) {
            const interval = result.interval < 1 ? 1000 : result.interval * 1000;
            setTimeout(resolve, interval)
        })
    })
}

const TransactionLooper = async function () {
    console.log("TransactionLooper", "begin");
    while (true) {
        const s = await sleep();
        const tx = transactions.shift();
        if (tx === undefined) {
            console.log("TransactionLooper", "idle");
            continue
        }
        try {
            const resp = await SendTransaction(tx.wallet, tx.to, tx.num);
            tx.onSuccess(resp)
        } catch (err) {
            tx.onError(err)
        }
    }
};

setTimeout(TransactionLooper);
const SendTransaction = function (wallet, to, num) {
    num = Number(num);
    return new Promise((rs, rj) => {
        const from = `0x${wallet.getAddress().toString('hex')}`;
        console.log("from", from);
        $.ajax({
            type: 'POST',
            url: "https://walletapi.onethingpcs.com/",
            data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "eth_getTransactionCount",
                "params": [from, "pending"],
                "id": 1
            }),
            contentType: 'application/json',
            success: function (TransactionCount) {
                let txParams = {
                    from: from,
                    to: to,
                    value: web3.toHex(web3.toWei(num)),
                    gasLimit: '0x186a0',
                    gasPrice: '0x174876e800',
                    nonce: TransactionCount.result,
                };
                let tx = new ethereumjs.Tx(txParams);
                tx.sign(wallet.getPrivateKey());

                const serializedTx = tx.serialize();
                const raw = `0x${serializedTx.toString('hex')}`;
                $.ajax({
                    type: 'POST',
                    url: "https://walletapi.onethingpcs.com/",
                    data: JSON.stringify({
                        "jsonrpc": "2.0",
                        "method": "eth_sendRawTransaction",
                        "params": [raw],
                        "id": 1
                    }),
                    contentType: 'application/json',
                    success: function (Transaction) {
                        rs(Transaction)
                    },
                    error: function (xhr, type) {
                        rj('eth_sendRawTransaction error!')
                    }
                })
            },
            error: function (xhr, type) {
                rj('eth_getTransactionCount error!')
            }
        })
    })
};

const PushTransaction = function (wallet, to, num) {
    return new Promise((rs, rj) => {
        transactions.push({
            wallet: wallet,
            to: to,
            num: num,
            onSuccess: msg => {
                rs(msg)
            },
            onError: err => {
                rj(err)
            }
        })
    })
};

const Reward = async function (wallet, is) {
    if (is) {
        const Transaction = await PushTransaction(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", 0.5);
        console.log(Transaction)
    }
};

const router = new __WEBPACK_IMPORTED_MODULE_1__router__["a" /* Router */]();

router.handle(__WEBPACK_IMPORTED_MODULE_0__consts__["e" /* TRANSACTION */], ctx => {
    return new Promise((resolve, reject) => {
        let {request} = ctx;
        chrome.storage.sync.get({
            "to_address": null,
            "password": null,
            "wallet": null,
        }, function (result) {
            const wallet = ethereumjs.Wallet.fromV3(result.wallet, result.password);
            const {to_address} = result;
            const {mode, limit, id, reward} = request;
            let num = limit.toFixed(0);
            const idNum = Number(`0.${id}`);
            if (idNum > limit) {
                resolve();
                return
            }
            if (mode === __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* QUICK */]) {
                if (num + idNum > limit) {
                    num = num - 1 + idNum
                } else {
                    num = num + idNum
                }
                const loop = async function () {
                    try {
                        const Transaction = await PushTransaction(wallet, to_address, `${num | 0}.${idNum.toString().slice(2)}`);
                        console.log(Transaction);

                        console.log(`ID: ${id} 需要喂养${limit} 共${((limit - num) / idNum).toFixed(0)}次`);
                        for (let i = num + idNum; i < limit; i += idNum) {
                            try {
                                const Transaction = await PushTransaction(wallet, to_address, idNum);
                                console.log(Transaction)
                            } catch (err) {
                                throw err
                            }
                        }
                        await Reward(wallet, reward)
                    } catch (err) {
                        throw err
                    }
                };
                loop().then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            } else if (mode === __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* SLOW */]) {
                let c = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* bestFeeding */])(limit, idNum)[0];
                console.log(`ID:${id} 需要喂养${limit} 共${c.list.length}次`);
                const loop = async function () {
                    for (let i of c.list) {
                        try {
                            console.log(i);
                            const Transaction = await PushTransaction(wallet, to_address, i);
                            console.log(Transaction)
                        } catch (err) {
                            throw err
                        }
                    }
                    await Reward(wallet, reward)
                };
                loop().then(() => {
                    resolve();
                }, () => {
                    reject()
                })
            } else {
                resolve()
            }
        })
    });
});

router.run();

/**
 * 监听页面变化
 */
chrome.webRequest.onCompleted.addListener(
    function (details) {
        console.log(details);
        chrome.tabs.query({active: true}, function (tabs) {
            console.log(tabs);
            chrome.storage.sync.get({
                "mode": __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* VALUE */],
                "min": 0.1,
                "kg": false,
                "wallet": null,
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (tab.url === "http://h.miguan.in/home") {
                    path = __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* HOME */];
                } else if (tab.url.indexOf("http://h.miguan.in/monkey") !== -1) {
                    path = __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* MONKEY */];
                } else {
                    return
                }
                result.path = path;
                chrome.tabs.sendMessage(tab.id, result, function (response) {
                    console.log(response);
                });
            })
        });
        return true;
    },
    {urls: ["http://h.miguan.in/*", "http://api.h.miguan.in/*"]}
);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bestFeeding;
class Combination {
    constructor(list = [], sum = 0) {
        this.list = list;
        this.sum = sum;
    }
}
function bestFeeding(limit, base) {
    let cs = [];
    let naiveBestFeeding = (newBase, p) => {
        for (let i = newBase; i < limit; i++) {
            let sum = p.sum + i;
            if (sum > limit) {
                if (p.list.length == 0 || p.sum + base < limit) {
                    return;
                }
                if (cs.length == 0 || cs[0].sum == p.sum) {
                    cs.push(new Combination(p.list, p.sum));
                }
                else if (cs[0].sum < p.sum) {
                    cs = [new Combination(p.list, p.sum)];
                }
                return;
            }
            let slice = p.list.slice();
            slice.push(`${i | 0}.${base.toString().slice(2)}`);
            naiveBestFeeding(i, new Combination(slice, sum));
        }
    };
    naiveBestFeeding(base, new Combination());
    cs.sort(((a, b) => {
        if (a.list.length < b.list.length) {
            return -1;
        }
        if (a.list.length > b.list.length) {
            return 1;
        }
        return 0;
    }));
    return cs;
}


/***/ })
/******/ ]);