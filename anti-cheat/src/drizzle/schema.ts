import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pc_number: text("pc_number").unique().notNull(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
  url: text("url").notNull(),
  prohibited_sites: text("prohibited_sites").array().notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id")
    .references(() => students.id)
    .notNull(),
  exam_id: integer("exam_id")
    .references(() => exams.id)
    .notNull(),
});

export const activity_logs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id")
    .references(() => students.id)
    .notNull(),
  exam_id: integer("exam_id")
    .references(() => exams.id)
    .notNull(),
  timestamp: timestamp("timestamp").notNull(),
  activity_type: text("activity_type").notNull(),
  details: jsonb("details"),
});
