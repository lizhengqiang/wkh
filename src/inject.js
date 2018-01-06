import { Router } from './router.ts';
import { HOME, MARKET, FULL, SLOW, QUICK, TRANSACTION, VALUE } from './consts.ts';


const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

const router = new Router();
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

// monkeys
router.handle(HOME, ctx => {
    return new Promise((resolve, reject) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(MONKEYS)) {
                // 掘金分数
                element$.find(".panel").forEach(monkey => {
                    let elementMonkey = $(monkey);

                    let btns = [];

                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最接近饱喂养</button>'),
                        mode: FULL
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最大次数喂养</button>'),
                        mode: SLOW
                    });
                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">最少次数喂养</button>'),
                        mode: QUICK
                    });
                    let percent = elementMonkey.find(".percent").first().text();
                    let doFeed = function (self, mode) {
                        GetWhiteList().then(whitelist => {
                            let promptInfo = "喂养一只猴子需要向作者转账0.5WKC请确认";
                            let reward = true;
                            if (ctx.request.wallet == null || ctx.request.wallet === "") {
                                alert("需要配置钱包文件");
                                return
                            }
                            let {address} = JSON.parse(ctx.request.wallet);
                            if (address === undefined) {
                                prompt("需要配置钱包文件");
                                return
                            }
                            if (whitelist.indexOf(`0x${address}`) !== -1) {
                                promptInfo = "请确定喂养";
                                reward = false;
                            }
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
router.handle(MARKET, ctx => {
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
                let digValue = info.split('•')[0].split('/')[2];
                let wkc = price.split(' ')[0];
                let span = $(element$.find(".price").find(".price span").get(0));
                if (span.text().indexOf(";") !== -1) {
                    wkc = span.text().split(';')[0]
                }
                let request = ctx.request;
                let mark = Number(digValue) * (request.kg === "true" ? Number(weight) : 1) / generationFactor(gen);
                let showMark = request.mode === VALUE ? mark : mark / Number(wkc);
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

const GetWhiteList = function () {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp)
        })
    })
};

const showScore = function (element$) {
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
    if (params.length < 3) {
        console.log("猴子属性拆分错误");
        return
    }
    const percents = element$.find(".percent").text().split("/");
    console.log(percents);
    if (percents.length < 2) {
        console.log("找不到投食进度");
        return
    }
    console.log(Number(words[2]), Number(params[2]), Number(percents[0]), generationFactor(words[1]));
    const score = Number(words[2]) * Number(params[2]) * Number(percents[0]) / generationFactor(words[1]);
    rowOne.text(`${showPosition} 掘金分数${score === 0 ? 0 : score.toFixed(5)}`);
};