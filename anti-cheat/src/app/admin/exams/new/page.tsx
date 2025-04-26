"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExam() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [url, setUrl] = useState("");
  const [prohibitedSites, setProhibitedSites] = useState("");
  const [monitoredEvents, setMonitoredEvents] = useState(""); // New field for DOM events
  const router = useRouter();

  const handleSubmit = async () => {
    const events = monitoredEvents
      .split(";")
      .map((event) => {
        const [selector, eventType, action] = event.split(",");
        return { selector, event: eventType, action };
      })
      .filter((e) => e.selector && e.event && e.action);

    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        start_time: startTime,
        end_time: endTime,
        url,
        prohibited_sites: prohibitedSites.split(",").map((s) => s.trim()),
        monitored_events: events,
      }),
    });
    if (res.ok) router.push("/admin/exams");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create New Exam</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exam Name"
      />
      <input
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        type="datetime-local"
      />
      <input
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        type="datetime-local"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Exam URL"
      />
      <input
        value={prohibitedSites}
        onChange={(e) => setProhibitedSites(e.target.value)}
        placeholder="Prohibited Sites (comma-separated)"
      />
      <input
        value={monitoredEvents}
        onChange={(e) => setMonitoredEvents(e.target.value)}
        placeholder="Monitored Events (e.g., #submit-button,click,submit_exam;)"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}
