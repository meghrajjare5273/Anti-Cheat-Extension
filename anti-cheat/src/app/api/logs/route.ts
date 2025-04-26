/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activity_logs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming logs
    const logsData = await req.json();

    // Process each log to ensure timestamps are Date objects
    const processedLogs = Array.isArray(logsData)
      ? logsData.map((log) => ({
          ...log,
          timestamp: new Date(log.timestamp), // Convert timestamp to Date object
        }))
      : {
          ...logsData,
          timestamp: new Date(logsData.timestamp), // Handle single log object
        };

    // Insert processed logs
    await db.insert(activity_logs).values(processedLogs);

    return NextResponse.json({ message: "Logs recorded" }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording logs:", error);
    return NextResponse.json(
      { error: "Failed to record logs", details: error.message },
      { status: 500 }
    );
  }
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
