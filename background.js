// let color = "#8000FF";

// browser.runtime.onInstalled.addListener(() => {
//     browser.storage.sync.set({ color });
//     console.log(`Default background color set to color: ${color}`);
// });

browser.action.onClicked.addListener(function (tab) {
    browser.action.setTitle({
        tabId: tab.id,
        title: `You are on tab: ${tab.id}`,
    });
});
