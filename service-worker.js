"use strict";

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-script.js"],
    });
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    let data;
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
