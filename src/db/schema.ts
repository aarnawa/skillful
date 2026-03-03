import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Users ───────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── Skills (self-referential tree) ──────────────────────
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("⭐"),
  color: text("color").notNull().default("#D4AF37"), // gold default
  parentId: integer("parent_id"),                     // null = root skill
  level: integer("level").notNull().default(0),       // depth in tree (0 = root)
  order: integer("order").notNull().default(0),       // display order among siblings
});

// ─── User Progress per Skill ─────────────────────────────
export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
  currentLevel: integer("current_level").notNull().default(0), // 0–100
  xp: integer("xp").notNull().default(0),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── Type exports ────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
