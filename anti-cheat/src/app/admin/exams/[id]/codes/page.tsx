"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { ArrowLeft, Plus, Copy, Check } from "lucide-react";
import Link from "next/link";

interface RegistrationCode {
  id: number;
  student_id: string | null;
  code: string;
}

export default function RegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }

    const fetchCodes = async () => {
      try {
        const res = await fetch(`/api/registration_codes?exam_id=${id}`);
        const data = await res.json();
        setCodes(data);
      } catch (error) {
        console.error("Failed to fetch registration codes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodes();
  }, [id, router]);

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/registration_codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam_id: Number.parseInt(id) }),
      });

      if (res.ok) {
        const newCode = await res.json();
        setCodes([...codes, newCode]);
      }
    } catch (error) {
      console.error("Failed to generate code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code: string, codeId: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(codeId);
    setTimeout(() => setCopiedId(null), 2000);
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
        <h1 className="text-2xl font-bold text-gray-800">Registration Codes</h1>
        <p className="text-gray-600">
          Manage registration codes for Exam #{id}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-700">
            Registration codes are used by students to register for this exam.
            Generate new codes and distribute them to students.
          </p>
          <button
            onClick={generateCode}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            {isGenerating ? "Generating..." : "Generate New Code"}
          </button>
        </div>

        {codes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No registration codes generated yet. Click the button above to
            generate a new code.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {code.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {code.student_id ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Used
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.student_id || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => copyToClipboard(code.code, code.id)}
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        disabled={!!copiedId}
                      >
                        {copiedId === code.id ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
