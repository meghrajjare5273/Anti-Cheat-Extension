import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, registrations, exams } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { name, pc_number, exam_id } = await req.json();

  // Query for existing student
  const existingStudents = await db
    .select()
    .from(students)
    .where(eq(students.pc_number, pc_number))
    .limit(1);

  let studentRecord;

  // Handle student creation or retrieval
  if (existingStudents.length === 0) {
    // Insert new student and get the result
    const newStudents = await db
      .insert(students)
      .values({ name, pc_number })
      .returning();
    studentRecord = newStudents[0];
  } else {
    // Use the existing student
    studentRecord = existingStudents[0];
  }

  // Now studentRecord is a single object, not an array
  const registration = await db
    .insert(registrations)
    .values({ student_id: studentRecord.id, exam_id })
    .returning();

  const registeredExams = await db
    .select({ exam: exams })
    .from(registrations)
    .leftJoin(exams, eq(registrations.exam_id, exams.id))
    .where(eq(registrations.student_id, studentRecord.id));

  return NextResponse.json(
    {
      registration: registration[0],
      student_id: studentRecord.id,
      exams: registeredExams.map((r) => r.exam),
    },
    { status: 201 }
  );
}
