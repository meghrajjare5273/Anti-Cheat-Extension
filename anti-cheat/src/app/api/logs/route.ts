import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activity_logs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const logs = await req.json();
  await db.insert(activity_logs).values(logs);
  return NextResponse.json({ message: "Logs recorded" }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exam_id = parseInt(searchParams.get("exam_id") || "0");
  const logs = await db
    .select()
    .from(activity_logs)
    .where(eq(activity_logs.exam_id, exam_id));
  return NextResponse.json(logs);
}
