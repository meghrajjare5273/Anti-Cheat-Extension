/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }
    fetch(`/api/logs?exam_id=${id}`)
      .then((res) => res.json())
      .then(setLogs);
  }, [id, router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Exam Logs</h1>
      <ul>
        {logs.map((log: any) => (
          <li key={log.id}>
            {log.timestamp} - {log.activity_type} -{" "}
            {JSON.stringify(log.details)}
          </li>
        ))}
      </ul>
    </div>
  );
}
