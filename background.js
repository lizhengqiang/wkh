console.log("background")
chrome.webRequest.onCompleted.addListener(
    function (details) {
        console.log(details)
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendRequest(tab.id, {}, function (response) {
                console.log(response);
            });
        });
        return true;
    },
    { urls: ["http://api.h.miguan.in/*"] }
)

