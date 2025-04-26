"use strict";
document.addEventListener("copy", () => {
    const selectedText = window.getSelection()?.toString();
    chrome.runtime.sendMessage({
        type: "clipboard_copy",
        details: { length: selectedText?.length },
    });
});
document.addEventListener("paste", () => {
    chrome.runtime.sendMessage({ type: "clipboard_paste" });
});
// Listen for monitored events from background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "set_monitored_events") {
        message.events.forEach(({ selector, event, action }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener(event, () => {
                    chrome.runtime.sendMessage({ type: action, details: { selector } });
                });
            }
        });
    }
});
