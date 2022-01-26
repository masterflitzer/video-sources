"use strict";

import "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js";

const injectContentScripts = (tab, scripts) => {
    const polyfill = [
        "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
    ];
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: polyfill.concat(scripts),
    });
};

const saveData = (payload) => {
    browser.storage.local.set({ data: payload });
};

browser.action.onClicked.addListener((tab) => {
    injectContentScripts(tab, ["./js/content.js"]);
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    saveData(message.payload);
    browser.runtime.openOptionsPage();
});
