"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Define an interface for the code object
interface RegistrationCode {
  id: number;
  student_id: string;
  code: string;
}

export default function RegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCode[]>([]);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin/login");
      return;
    }
    fetch(`/api/registration_codes?exam_id=${id}`)
      .then((res) => res.json())
      .then((data) => setCodes(data));
  }, [id, router]);

  const generateCode = async () => {
    const res = await fetch(`/api/registration_codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam_id: parseInt(id) }),
    });
    if (res.ok) {
      const newCode = await res.json();
      setCodes([...codes, newCode]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registration Codes for Exam {id}</h1>
      <button onClick={generateCode}>Generate New Code</button>
      <ul>
        {codes.map((code) => (
          <li key={code.id}>
            Student ID: {code.student_id} - Code: {code.code}
          </li>
        ))}
      </ul>
    </div>
  );
}
