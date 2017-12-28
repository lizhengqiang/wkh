console.log("background")
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

