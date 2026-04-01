import { pgTable, text, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 16 }).notNull().default("CHANGEME"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Skills (self-referential tree) ──────────────────────
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 50 }).notNull().default("⭐"),
  color: varchar("color", { length: 20 }).notNull().default("#D4AF37"), // gold default
  parentId: integer("parent_id"),                     // null = root skill
  level: integer("level").notNull().default(0),       // depth in tree (0 = root)
  order: integer("order").notNull().default(0),       // display order among siblings
});

// ─── User Progress per Skill ─────────────────────────────
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
  currentLevel: integer("current_level").notNull().default(0), // 0–100
  xp: integer("xp").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Type exports ────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
