import { Router, Context } from './router.ts';
import { QUICK, SLOW, VALUE } from "./modes";

const ELEMENT = "element$";
const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

let router = new Router();
// monkeys
router.handle(`/${MONKEYS}`, ctx => {
    let element$ = ctx.values[ELEMENT];
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
            if (!confirmed) {
                if (!confirm("喂养一只猴子需要向作者转账0.5WKC请确认")) {
                    return
                }
                confirmed = true
            }
            btns.forEach(btn => {
                btn.button.hide()
            });
            chrome.runtime.sendMessage({
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
        console.log("has button", elementMonkey.has("button").length);
        if (elementMonkey.find("button").length === 0) {
            btns.forEach(btn => {
                elementMonkey.append(btn.button);
            });
        }
    })
});
//items
router.handle(`/${ITEM}`, ctx => {
    let element$ = ctx.values[ELEMENT];
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
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("页面发生变化");
        setTimeout(function () {
            $("div").forEach(element => {
                let element$ = $(element);

                if (element$.hasClass(MONKEYS)) {
                    let context = new Context();
                    context.request = request;
                    context.sender = sender;
                    context.sendResponse = sendResponse;
                    context.values[ELEMENT] = element$;
                    router.serve(`/${MONKEYS}`, context)
                }
                if (element$.hasClass(ITEM)) {
                    let context = new Context();
                    context.request = request;
                    context.sender = sender;
                    context.sendResponse = sendResponse;
                    context.values[ELEMENT] = element$;
                    router.serve(`/${ITEM}`, context);
                }
            });
        }, 1000);
        sendResponse({})
    }
);

