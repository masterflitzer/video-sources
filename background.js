"use strict";

import "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js";

const injectContentScripts = (tab, scripts) => {
    const polyfill = [
        "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
    ];
    browser.scripting
        .executeScript({
            target: { tabId: tab.id },
            files: polyfill.concat(scripts),
        })
        .then(() => {
            console.info("Sucessfully injected the content script");
        })
        .catch((error) => {
            console.warn(
                `An error occurred while injecting the content script: ${error}`
            );
        });
};

// const sendData = (tab, data) => {
//     browser.tabs
//         .sendMessage(tab.id, {
//             type: "render",
//             payload: data,
//         })
//         .then((response) => {
//             console.info(response.message);
//         })
//         .catch((response) => {
//             console.warn(response.message);
//         });
// };

// const spawnResult = (data) => {
//     // browser.tabs
//     //     .create({
//     //         active: true,
//     //         url: browser.runtime.getURL("index.html"),
//     //     })
//     //     .then((tab) => {
//     //         injectContentScripts(tab, ["./js/content-render.js"]);
//     //         sendData(tab, data);
//     //     })
//     //     .catch((error) => {
//     //         console.error(`An error occurred while creating the tab: ${error}`);
//     //     });
//     browser.runtime.openOptionsPage();
//     browser.tabs
//         .query({
//             active: true,
//             currentWindow: true,
//         })
//         .then((tab) => {
//             tab = tab[0];
//             console.log(tab);
//             injectContentScripts(tab, ["./js/content-render.js"]);
//             sendData(tab, data);
//         })
//         .catch((error) => {
//             console.error(`An error occurred: ${error}`);
//         });
// };

const savePayload = (payload) => {
    browser.storage.local
        .set({ data: payload })
        .then(() => {
            console.info("Sucessfully saved the payload to local storage");
        })
        .catch((error) => {
            console.warn(
                `An error occurred while saving the payload to local storage: ${error}`
            );
        });
};

browser.action.onClicked.addListener((tab) => {
    injectContentScripts(tab, ["./js/content.js"]);
});

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "collect") {
        if (message.payload === null) {
            return Promise.reject({ message: "collect: payload is null" });
        } else {
            savePayload(message.payload);
            browser.runtime.openOptionsPage();
            return Promise.resolve({
                message: "collect: sucessfully received payload",
            });
        }
    } else {
        return Promise.reject({ message: "collect: unknown request type" });
    }
});
