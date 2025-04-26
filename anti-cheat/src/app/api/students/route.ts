import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students } from "@/drizzle/schema";

export async function GET() {
  const allStudents = await db.select().from(students);
  return NextResponse.json(allStudents);
}
