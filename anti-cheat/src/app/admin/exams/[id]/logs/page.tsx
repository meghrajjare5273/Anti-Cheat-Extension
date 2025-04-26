/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { ArrowLeft, Search, AlertTriangle, Clock, Info } from "lucide-react";
import Link from "next/link";

interface Log {
  id: number;
  student_id: number;
  exam_id: number;
  timestamp: string;
  activity_type: string;
  details: any;
}

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/logs?exam_id=${id}`);
        const data = await res.json();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [id, router]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = logs.filter(
        (log) =>
          log.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          JSON.stringify(log.details)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [searchTerm, logs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "url_access":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "tab_switch":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "clipboard_copy":
      case "clipboard_paste":
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityClass = (type: string) => {
    switch (type) {
      case "url_access":
        return "bg-red-50 border-red-200";
      case "tab_switch":
        return "bg-blue-50 border-blue-200";
      case "clipboard_copy":
      case "clipboard_paste":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </DashboardLayout>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800">Exam Activity Logs</h1>
        <p className="text-gray-600">
          Monitoring student activities during Exam #{id}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logs by activity type or details..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No logs found for this exam.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-lg p-4 ${getSeverityClass(
                  log.activity_type
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(log.activity_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {log.activity_type.replace(/_/g, " ")}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Student ID: {log.student_id}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded border border-gray-200">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
