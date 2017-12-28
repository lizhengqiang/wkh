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
                    if (span.text().indexOf(";") === -1) {
                        span.text(wkc + ";" + (arg1 * arg3 * kg / wkc).toFixed(2))
                        var mark = arg1 * arg3 * kg / wkc
                        if (mark > 0.08) {
                            $(element).prop("style", "background:#F00;")
                        }
                    }
                    console.log(kg, arg1, arg3, wkc)
                }
            });
        }, 1000)
        sendResponse({})
    });

