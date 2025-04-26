"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewExam() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [url, setUrl] = useState("");
  const [prohibitedSites, setProhibitedSites] = useState("");
  const [monitoredEvents, setMonitoredEvents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Parse monitored events
      const events = monitoredEvents
        .split(";")
        .map((event) => {
          const [selector, eventType, action] = event
            .split(",")
            .map((item) => item.trim());
          if (!selector || !eventType || !action) return null;
          return { selector, event: eventType, action };
        })
        .filter(Boolean);

      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          start_time: startTime,
          end_time: endTime,
          url,
          prohibited_sites: prohibitedSites
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          monitored_events: events,
        }),
      });

      if (res.ok) {
        router.push("/admin/exams");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create exam");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/admin/exams"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exams
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Exam</h1>
        <p className="text-gray-600">
          Set up a new exam with monitoring settings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Exam Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                placeholder="e.g. Midterm Exam"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                Exam URL *
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                placeholder="https://example.com/exam"
                required
              />
              <p className="text-xs text-gray-500">
                The URL where students will take the exam
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Time *
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Time *
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="prohibitedSites"
              className="block text-sm font-medium text-gray-700"
            >
              Prohibited Sites
            </label>
            <input
              id="prohibitedSites"
              type="text"
              value={prohibitedSites}
              onChange={(e) => setProhibitedSites(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              placeholder="chegg.com, coursehero.com, stackoverflow.com"
            />
            <p className="text-xs text-gray-500">
              Comma-separated list of websites students are not allowed to visit
              during the exam
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="monitoredEvents"
              className="block text-sm font-medium text-gray-700"
            >
              Monitored Events
            </label>
            <textarea
              id="monitoredEvents"
              value={monitoredEvents}
              onChange={(e) => setMonitoredEvents(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              placeholder="#submit-button,click,submit_exam; .answer-field,change,answer_changed"
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Format: CSS selector, event type, action name; separated by
              semicolons
              <br />
              Example: #submit-button,click,submit_exam;
              .answer-field,change,answer_changed
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {isSubmitting ? "Creating..." : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
