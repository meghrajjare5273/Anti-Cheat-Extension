/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Students() {
  const [students, setStudents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/students")
      .then((res) => res.json())
      .then(setStudents);
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registered Students</h1>
      <ul>
        {students.map((student: any) => (
          <li key={student.id}>
            {student.name} - {student.pc_number}
          </li>
        ))}
      </ul>
    </div>
  );
}
