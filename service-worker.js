// let color = "#8000FF";

// browser.runtime.onInstalled.addListener(() => {
//     browser.storage.sync.set({ color });
//     console.log(`Default background color set to color: ${color}`);
// });

browser.action.onClicked.addListener((tab) => {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: "content-script.js",
    });
    // browser.tabs;
    browser.action.setTitle({
        tabId: tab.id,
        title: `You are on tab: ${tab.id}`,
    });
});

function sanitizeInput(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
}
