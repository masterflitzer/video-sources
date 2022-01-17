"use strict";

import "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js";

browser.action.onClicked.addListener((tab) => {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: [
            "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
            "./js/content-script.js",
        ],
    });
});

browser.runtime.onMessage.addListener((request, sender) => {
    if (request.type === "res") {
        return browser.tabs.create({
            active: true,
            url: browser.runtime.getURL("index.html"),
        });
    } else if (request.type === "req") {
        return Promise.resolve({ type: "res", payload: request.payload });
    } else {
        return Promise.reject({ reason: "unknown message type" });
    }
});
