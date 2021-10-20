"use strict";

chrome.runtime.sendMessage({ type: "req" }, (response) => {
    let data = response.payload;
    document.getElementById("copy-json").addEventListener("click", () => {
        copy(data);
    });
    generateDataOverview(data);
});

document.getElementById("copy-json").addEventListener("click", () => {
    let icon = document.getElementById("clipboard-icon");
    icon.setAttribute(
        "class",
        icon.attributes.class.value.replace(
            "bi-clipboard-data",
            "bi-clipboard-check"
        )
    );
    setTimeout(() => {
        icon.setAttribute(
            "class",
            icon.attributes.class.value.replace(
                "bi-clipboard-check",
                "bi-clipboard-data"
            )
        );
        document.getElementById("copy-json").blur();
    }, 5000);
});

function copy(value) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value);
    } else {
        let hidden = document.createElement("input");
        hidden.disabled = true;
        hidden.type = "hidden";
        hidden.value = value;
        document.appendChild(hidden);
        hidden.select();
        document.execCommand("copy");
        document.removeChild(hidden);
    }
}

function generateDataOverview(data) {
    let test = document.createElement("p");
    test.textContent = data;
    document.getElementById("placeholder").appendChild(test);
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (tabId === tab.id && changeInfo.status === "complete") {
//     }
// });
