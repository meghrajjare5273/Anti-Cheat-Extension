import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  students,
  registrations,
  exams,
  registration_codes,
} from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { name, pc_number, exam_id, code } = await req.json();

  // Verify registration code - Fixed the chaining issue
  const validCode = await db
    .select()
    .from(registration_codes)
    .where(
      and(
        eq(registration_codes.code, code),
        eq(registration_codes.exam_id, exam_id)
      )
    )
    .limit(1);

  if (validCode.length === 0) {
    return NextResponse.json(
      { message: "Invalid registration code" },
      { status: 401 }
    );
  }

  // Query for existing student
  const existingStudents = await db
    .select()
    .from(students)
    .where(eq(students.pc_number, pc_number))
    .limit(1);

  let studentRecord;

  if (existingStudents.length === 0) {
    const newStudents = await db
      .insert(students)
      .values({ name, pc_number })
      .returning();
    studentRecord = newStudents[0];
  } else {
    studentRecord = existingStudents[0];
  }

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
