"use strict";

// add to background in manifest.json: "type": "module"
// import browser from "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js";

let data;

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-script.js"],
    });
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.type === "res") {
        data = request.payload;
        chrome.tabs.create({
            active: true,
            url: chrome.runtime.getURL("index.html"),
        });
    } else if (request.type === "req") {
        response({ type: "res", payload: data });
    } else {
        console.error("received unknown message type");
    }
});

// chrome.action.onClicked.addListener((tab) => {
//     chrome.tabs
//         .query({
//             active: true,
//             currentWindow: true,
//         })
//         .then((tabs) => {
//             chrome.tabs.sendMessage(
//                 tabs[0].id,
//                 { payload: "SW -> CS" },
//                 (response) => {
//                     console.log(`[SW] Response: ${response.payload}`);
//                 }
//             );
//         });
// });
