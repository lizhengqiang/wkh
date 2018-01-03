import { Router } from './router.ts';
import { HOME, MONKEY, SLOW, QUICK, TRANSACTION, VALUE } from './consts.ts';


const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

const router = new Router();
router.use(ctx => {
    console.log("页面发生变化");
    ctx.next();
});

// monkeys
router.handle(HOME, ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(MONKEYS)) {
                element$.find(".panel").forEach(monkey => {
                    let btns = [];

                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最大次数喂养</button>'),
                        mode: SLOW
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最少次数喂养</button>'),
                        mode: QUICK
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
                                path: TRANSACTION,
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
router.handle(MONKEY, ctx => {
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
                let showMark = request.mode === VALUE ? mark : mark / wkc;
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