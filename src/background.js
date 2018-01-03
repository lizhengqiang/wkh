import { QUICK, VALUE, HOME, MONKEY, TRANSACTION } from "./consts";
import { Router } from "./router";

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
    num = Number(num.toFixed(6));
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

const router = new Router();

router.handle(TRANSACTION, ctx => {
    return new Promise((resolve, reject) => {
        let {request} = ctx;
        chrome.storage.sync.get({
            "to_address": null,
            "password": null,
            "wallet": null,
        }, function (result) {
            const wallet = ethereumjs.Wallet.fromV3(result.wallet, result.password);
            const from = `0x${wallet.getAddress().toString('hex')}`;
            const {to_address} = result;
            const {mode, limit, id, reward} = request;
            let num = limit.toFixed(0);
            const idNum = Number(`0.${id}`);
            if (idNum > limit) {
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
                        const Transaction = await PushTransaction(wallet, to_address, num);
                        console.log(Transaction);

                        console.log("ID", id, "需要喂养", limit, ((limit - num) / idNum).toFixed(0) + "次");
                        for (let i = num + idNum; i < limit; i += idNum) {
                            try {
                                const Transacation = await PushTransaction(wallet, to_address, idNum);
                                console.log(Transacation)
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
            } else {
                console.log("ID", id, "需要喂养", limit, (limit / idNum).toFixed(0) + "次");
                const loop = async function () {
                    for (let i = idNum; i < limit; i += idNum) {
                        try {
                            console.log(idNum, i + "/" + limit);
                            const Transacation = await PushTransaction(wallet, to_address, idNum);
                            console.log(Transacation)
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
                "mode": VALUE,
                "min": 0.1,
                "kg": false,
                "wallet": null,
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (tab.url === "http://h.miguan.in/home") {
                    path = HOME;
                } else if (tab.url.indexOf("http://h.miguan.in/monkey") !== -1) {
                    path = MONKEY;
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