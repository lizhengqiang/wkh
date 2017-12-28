chrome.storage.sync.get({
    "mode": "value",
    "min": 0.1,
    "kg": false,
    "from_address": null,
    "to_address": null,
    "password": null,
}, function (result) {
    $("#mode").val(result.mode)
    $("#min").val(result.min)
    $("#kg").val(result.kg)
    $("#from_address").val(result.from_address)
    $("#to_address").val(result.to_address)
    $("#password").val(result.password)
})
$("#update").click(function () {
    console.log("update")
    chrome.storage.sync.set({
        "mode": $("#mode").val(),
        "min": $("#min").val(),
        "kg": $("#kg").val(),
        "from_address": $("#from_address").val(),
        "to_address": $("#to_address").val(),
        "password": $("#password").val(),
    }, function (result) {
        console.log(result)
    })
})