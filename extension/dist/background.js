"use strict";
let registeredExams = [];
let studentId = null;
let lastActiveTabId = null;
const tabToExam = {};
let logs = [];
chrome.storage.local.get(["registeredExams", "student_id", "pendingLogs"], (result) => {
    registeredExams = result.registeredExams || [];
    studentId = result.student_id || null;
    logs = result.pendingLogs || [];
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.registeredExams)
        registeredExams = changes.registeredExams.newValue;
    if (changes.student_id)
        studentId = changes.student_id.newValue;
});
function isExamActive(exam) {
    const now = new Date();
    return new Date(exam.start_time) <= now && now <= new Date(exam.end_time);
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        const activeExam = registeredExams.find((exam) => tab.url === exam.url && isExamActive(exam));
        if (activeExam) {
            tabToExam[tabId] = activeExam.id;
            chrome.scripting.executeScript({
                target: { tabId },
                files: ["content.js"],
            });
            // Send monitored events to content script
            chrome.tabs.sendMessage(tabId, {
                type: "set_monitored_events",
                events: activeExam.monitored_events,
            });
        }
        else {
            delete tabToExam[tabId];
        }
    }
});
chrome.tabs.onActivated.addListener((activeInfo) => {
    const newTabId = activeInfo.tabId;
    if (lastActiveTabId && tabToExam[lastActiveTabId] && !tabToExam[newTabId]) {
        logActivity(studentId, tabToExam[lastActiveTabId], "tab_switch", {
            fromTabId: lastActiveTabId,
            toTabId: newTabId,
        });
    }
    lastActiveTabId = newTabId;
});
chrome.webNavigation.onCompleted.addListener((details) => {
    if (registeredExams.some(isExamActive)) {
        registeredExams.filter(isExamActive).forEach((exam) => {
            if (exam.prohibited_sites.some((site) => details.url.includes(site))) {
                logActivity(studentId, exam.id, "url_access", { url: details.url });
            }
            if (details.url.startsWith("https://www.google.com/search")) {
                const query = new URL(details.url).searchParams.get("q");
                logActivity(studentId, exam.id, "search_query", { query });
            }
        });
    }
});
chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab?.id;
    if (tabId && tabToExam[tabId]) {
        logActivity(studentId, tabToExam[tabId], message.type, message.details);
    }
});
function logActivity(studentId, examId, type, details) {
    const log = {
        student_id: studentId,
        exam_id: examId,
        timestamp: new Date().toISOString(),
        activity_type: type,
        details,
    };
    logs.push(log);
    chrome.storage.local.set({ pendingLogs: logs });
}
setInterval(() => {
    if (logs.length > 0 && studentId) {
        fetch("http://localhost:3000/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logs),
        })
            .then((res) => {
            if (res.ok) {
                logs = [];
                chrome.storage.local.set({ pendingLogs: logs });
            }
        })
            .catch(() => {
            console.error("Failed to send logs");
        });
    }
}, 3000);
