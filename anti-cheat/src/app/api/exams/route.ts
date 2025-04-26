import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exams } from "@/drizzle/schema";

export async function GET() {
  const allExams = await db.select().from(exams);
  return NextResponse.json(allExams);
}

export async function POST(req: NextRequest) {
  const { name, start_time, end_time, url, prohibited_sites } =
    await req.json();

  // Convert string dates to Date objects
  const newExam = await db
    .insert(exams)
    .values({
      name,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      url,
      prohibited_sites,
    })
    .returning();

  return NextResponse.json(newExam[0], { status: 201 });
}
