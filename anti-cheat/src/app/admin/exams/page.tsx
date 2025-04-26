/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/exams")
      .then((res) => res.json())
      .then(setExams);
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Exams</h1>
      <button onClick={() => router.push("/admin/exams/new")}>
        Create New Exam
      </button>
      <button onClick={() => router.push("/admin/students")}>
        View Students
      </button>
      <ul>
        {exams.map((exam: any) => (
          <li key={exam.id}>
            {exam.name} -{" "}
            <button onClick={() => router.push(`/admin/exams/${exam.id}/logs`)}>
              View Logs
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
