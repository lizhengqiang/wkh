import {VALUE} from "./consts";

const interval = 'interval';
const mode = 'mode';
const min = 'min';
const kg = 'kg';
const wallet = 'wallet';
const to_address = 'to_address';
const password = 'password';

chrome.storage.sync.get({
    [interval]: 5,
    [mode]: VALUE,
    [min]: 0.1,
    [kg]: false,
    [wallet]: null,
    [to_address]: null,
    [password]: null,
}, function (result) {
    $("#interval").val(result.interval);
    $("#mode").val(result.mode);
    $("#min").val(result.min);
    $("#kg").val(result.kg);
    $("#wallet").val(result.wallet);
    $("#to_address").val(result.to_address);
    $("#password").val(result.password);
});

const DoUpdate = () => {
    console.log("update");
    chrome.storage.sync.set({
        [interval]: $('#interval').val(),
        [mode]: $("#mode").val(),
        [min]: $("#min").val(),
        [kg]: $("#kg").val(),
        [wallet]: $("#wallet").val(),
        [to_address]: $("#to_address").val(),
        [password]: $("#password").val(),
    }, function (result) {
        console.log(result)
    })
};

$("input").change(DoUpdate);
$("#update").click(DoUpdate);
$("#like").click(function () {
    DoUpdate();
    chrome.runtime.sendMessage({
        to_address: "0x1889aea32bebda482440393d470246561a4e6ca6"
    }, function (response) {
        console.log(response);
    });
});