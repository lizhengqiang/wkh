console.log("inject")
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log("request")
        setTimeout(function () {
            $("div").forEach(element => {
                if ($(element).hasClass("item")) {
                    var info = $($(element).find(".info p").get(1)).text()
                    var priceDiv = $(element).find(".price span").first()
                    var price = $($(element).find(".price span").get(0)).text()
                    var kg = info.split('·')[1].split(' ')[0]
                    var arg1 = info.split('·')[0].split('/')[0]
                    var arg2 = info.split('·')[0].split('/')[1]
                    var arg3 = info.split('·')[0].split('/')[2]
                    var wkc = price.split(' ')[0]
                    var span = $($(element).find(".price").find(".price span").get(0))
                    if (span.text().indexOf(";") !== -1) {
                        wkc = span.text().split(';')[0]
                    }
                    console.log(request.mode, request.min)
                    var mark = arg1 * arg3 * (request.kg == "true" ? kg : 1);
                    var showMark = request.mode == "value" ? mark : mark / wkc
                    span.text(wkc + ";" + (showMark).toFixed(2))
                    if (showMark >= request.min) {
                        $(element).prop("style", "background:#F00;")
                    }
                }
            });
        }, 1000)
        sendResponse({})
    });

