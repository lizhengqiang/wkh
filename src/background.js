import Web3 from "web3";
import Transaction from "ethereumjs-tx";
import Wallet from "ethereumjs-wallet";
import { FULL, QUICK, SLOW, VALUE, HOME, TRANSACTION, MARKET, REWARD, ALERT } from "./consts";
import { SingleTransaction } from "./entity/transction";
import { Router } from "./router";
import { bestFeeding, whiteList } from "./utils";

console.log("background");

const web3 = new Web3();
const transactions = [];
const router = new Router();

router.handle(TRANSACTION, ctx => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            "to_address": null,
            "password": null,
            "wallet": null,
        }, function (result) {
            const wallet = Wallet.fromV3(result.wallet, result.password);
            const {to_address} = result;
            let {request} = ctx;
            const {mode, limit, id} = request;
            let num = limit.toFixed(0);
            const idNumStr = `0.${id}`;
            const idNum = Number(idNumStr);
            if (idNum > limit) {
                resolve();
                return
            }
            if (mode === QUICK) {
                if (num + idNum > limit) {
                    num = num - 1 + idNum
                } else {
                    num = num + idNum
                }
                const loop = async function () {
                    try {
                        const firstTransaction = await PushTransaction(wallet, to_address, `${num | 0}.${idNumStr.slice(2)}`);
                        console.log(firstTransaction);

                        console.log(`ID: ${id} 需要喂养${limit} 共${((limit - num) / idNum).toFixed(0)}次`);
                        for (let i = num + idNum; i < limit; i += idNum) {
                            try {
                                const transaction = await PushTransaction(wallet, to_address, idNumStr);
                                console.log(transaction)
                            } catch (err) {
                                throw err
                            }
                        }
                    } catch (err) {
                        throw err
                    }
                };
                loop().then(() => {
                    resolve();
                }, (err) => {
                    reject(err);
                });
            } else if (mode === FULL) {
                let c = bestFeeding(limit, idNum)[0];
                console.log(`ID:${id} 需要喂养${limit} 共${c.list.length}次`);
                const loop = async function () {
                    for (let i of c.list) {
                        try {
                            console.log(i);
                            const transaction = await PushTransaction(wallet, to_address, i);
                            console.log(transaction)
                        } catch (err) {
                            throw err
                        }
                    }
                };
                loop().then(() => {
                    resolve();
                }, (err) => {
                    reject(err)
                })
            } else if (mode === SLOW) {
                let times = (limit / idNum) | 0;
                console.log(`ID: ${id} 需要喂养${limit} 共${times}次`);
                const loop = async function () {
                    for (let i = 0; i < times; i++) {
                        try {
                            console.log(idNum);
                            const Transaction = await PushTransaction(wallet, to_address, idNumStr);
                            console.log(Transaction)
                        } catch (err) {
                            throw err
                        }
                    }
                };
                loop().then(() => {
                    resolve();
                }, (err) => {
                    reject(err)
                })
            }
            else {
                resolve()
            }
        })
    });
});

router.handle(REWARD, ctx => {
        return new Promise((resolve, reject) => {
            PushTransaction(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", "0.5")
                .then(() => {
                    console.log("准备打赏");
                    resolve();
                });
        });
    }
);

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
                "mode": VALUE,
                "min": 0.1,
                "kg": false,
                "wallet": null,
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (result.wallet === null || result.wallet === "") {
                    chrome.tabs.sendMessage(tab.id, {
                        path: ALERT,
                        alert: "需要配置钱包文件"
                    });
                    return
                }
                result.wallet = JSON.parse(result.wallet);
                whiteList().then(roll => {
                    if (roll.indexOf(`0x${result.wallet.address}`) === -1) {
                        chrome.tabs.sendMessage(tab.id, {
                            path: ALERT,
                            alert: "需要加入白名单"
                        });
                        return
                    }
                    if (tab.url === "http://h.miguan.in/home") {
                        path = HOME;
                    } else if (tab.url.indexOf("http://h.miguan.in/market") !== -1) {
                        path = MARKET;
                    } else {
                        return
                    }
                    result.path = path;
                    chrome.tabs.sendMessage(tab.id, result, function (response) {
                        console.log(response);
                    });
                });
            })
        });
        return true;
    },
    {urls: ["http://h.miguan.in/*"]}
);

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

const TransactionLoop = async function () {
    console.log("TransactionLoop", "begin");
    while (true) {
        await sleep();
        const tx = transactions.shift();
        if (tx === undefined) {
            console.log("TransactionLoop", "idle");
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

const SendTransaction = function (wallet, to, num) {
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
            success: function (transactionCount) {
                let txParams = {
                    from: from,
                    to: to,
                    value: web3.utils.toHex(web3.utils.toWei(num, 'ether')),
                    gasLimit: '0x186a0',
                    gasPrice: '0x174876e800',
                    nonce: transactionCount.result,
                };
                let tx = new Transaction(txParams);
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
                    success: function (transaction) {
                        rs(transaction)
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
        transactions.push(
            new SingleTransaction(wallet, to, num, msg => {
                rs(msg)
            }, err => {
                rj(err)
            }))
    })
};

setTimeout(TransactionLoop);