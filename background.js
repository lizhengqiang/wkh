console.log("background")
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        chrome.storage.sync.get({
            "from_address": null,
            "to_address": null,
            "password": null,
        }, function (result) {
            $.ajax({
                type: 'POST',
                url: "http://localhost:65399/feedmonkeys",
                data: JSON.stringify({
                    "from_address": result.from_address,
                    "to_address": result.to_address,
                    "pwd": result.password,
                    "monkeys": [{ id: request.id, limit: request.limit, mode: request.mode }]

                }),
                contentType: 'application/json',
                success: function (data) {
                    sendResponse(request)
                },
                error: function (xhr, type) {
                    alert('Ajax error!')
                }
            })

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

