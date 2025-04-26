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
