
var rf = require("fs");
var http = require('http');
var url = require('url');
var fs = require('fs');
var Web3 = require('web3');
var web3 = Web3.utils;
var ethereumjsWallet = require('ethereumjs-wallet');
var ethereumjsTx = require('ethereumjs-tx')
var request = require('request')
var data = rf.readFileSync("./wallet", "utf-8");
var password = rf.readFileSync("./password", "utf-8");
var wallet = ethereumjsWallet.fromV3(data, password);
var from = `0x${wallet.getAddress().toString('hex')}`;
console.log(from)
require('request').debug = true
var headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Content-Type": "text/plain",
    "Host": "walletapi.onethingpcs.com",
    "Origin": "chrome-extension://aejoelaoggembcahagimdiliamlcdmfm",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
}
var server = http.createServer(function (req, res) {
    var u = url.parse(req.url, true);
    console.log(u.query)
    var to = u.query.to
    var amount = u.query.amount
    console.log(from, to, amount);
    request({
        url: "https://walletapi.onethingpcs.com/",
        method: "POST",
        body: {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionCount",
            "params": [from, "pending"],
            "id": 1
        },
        json: true,
        headers: headers,
    }, function (err, httpResponse, TransactionCount) {
        if (err) {
            res.writeHead(400);
            res.end('eth_getTransactionCount error!')
        }
        console.log("TransactionCount", TransactionCount)
        var txParams = {
            from: from,
            to: to,
            value: web3.toHex(web3.toWei(Number(amount), 'ether')),
            gasLimit: '0x186a0',
            gasPrice: '0x174876e800',
            nonce: TransactionCount.result,
        };
        console.log(txParams)
        var tx = new ethereumjsTx(txParams);
        tx.sign(wallet.getPrivateKey());
        var serializedTx = tx.serialize();
        var raw = `0x${serializedTx.toString('hex')}`;
        request.post("https://walletapi.onethingpcs.com/", {
            body: {
                "jsonrpc": "2.0",
                "method": "eth_sendRawTransaction",
                "params": [raw],
                "id": 1
            },
            json: true,
            headers: headers,
        }, function (err, httpResponse, Transaction) {
            if (err) {
                res.writeHead(400);
                res.end('eth_sendRawTransaction error!')
            }
            res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-8" });
            res.end(JSON.stringify(Transaction))
        })
    })
}).listen(8080, '0.0.0.0')