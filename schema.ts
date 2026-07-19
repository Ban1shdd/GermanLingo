import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  hearts: integer("hearts").notNull().default(5),
  gems: integer("gems").notNull().default(50),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  orderIndex: integer("order_index").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 10 }),
  color: varchar("color", { length: 20 }),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  orderIndex: integer("order_index").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 30 }).notNull().default("standard"),
  xpReward: integer("xp_reward").notNull().default(10),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  orderIndex: integer("order_index").notNull(),
  type: varchar("type", { length: 30 }).notNull(),
  prompt: text("prompt").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options"),
  hint: text("hint"),
  audioWord: varchar("audio_word", { length: 200 }),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  completed: boolean("completed").notNull().default(false),
  stars: integer("stars").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  completedAt: timestamp("completed_at"),
}, (table) => [
  uniqueIndex("user_lesson_idx").on(table.userId, table.lessonId),
]);

export const streakHistory = pgTable("streak_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityDate: date("activity_date").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
}, (table) => [
  uniqueIndex("user_date_idx").on(table.userId, table.activityDate),
]);

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  requirement: integer("requirement").notNull().default(1),
  category: varchar("category", { length: 30 }).notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("user_achievement_idx").on(table.userId, table.achievementId),
]);
