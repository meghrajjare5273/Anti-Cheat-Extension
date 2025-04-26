"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Plus, Eye, Clock } from "lucide-react";
import Link from "next/link";

interface Exam {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  url: string;
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }

    const fetchExams = async () => {
      try {
        const res = await fetch("/api/exams");
        const data = await res.json();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (exam: Exam) => {
    const now = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(exam.end_time);

    if (now < startTime) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Upcoming
        </span>
      );
    } else if (now >= startTime && now <= endTime) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Completed
        </span>
      );
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
          <p className="text-gray-600">Manage and monitor all exams</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create New Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            No exams found. Create your first exam to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{exam.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {exam.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(exam)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(exam.start_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(exam.end_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/exams/${exam.id}/logs`}
                        className="text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1 rounded-md flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Logs
                      </Link>
                      <Link
                        href={`/admin/exams/${exam.id}/codes`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md"
                      >
                        Registration Codes
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
