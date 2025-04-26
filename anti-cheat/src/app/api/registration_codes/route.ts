import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registration_codes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exam_id = parseInt(searchParams.get("exam_id") || "0");
  const codes = await db
    .select()
    .from(registration_codes)
    .where(eq(registration_codes.exam_id, exam_id));
  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const { exam_id } = await req.json();
  const code = crypto.randomBytes(8).toString("hex"); // Generate a unique code
  const newCode = await db
    .insert(registration_codes)
    .values({ student_id: null, exam_id, code }) // Student ID can be null initially
    .returning();
  return NextResponse.json(newCode[0], { status: 201 });
}
