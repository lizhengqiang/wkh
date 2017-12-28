chrome.storage.sync.get({
    "mode": "value",
    "min": 0.1,
    "kg": false,
}, function (result) {
    $("#mode").val(result.mode)
    $("#min").val(result.min)
    $("#kg").val(result.kg)
})
$("#update").click(function () {
    console.log("update")
    chrome.storage.sync.set({
        "mode": $("#mode").val(),
        "min": $("#min").val(),
        "kg": $("#kg").val()
    }, function (result) {
        console.log(result)
    })
})