import {
  pgTable,
  boolean,
  varchar,
  uuid,
  text,
  integer,
  timestamp,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  passwordHash: varchar("password", { length: 256 }),
  profile_picture_url: text("profile_picture_url"),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  gender: varchar("gender", { length: 10 }),
  is_verified: boolean("is_verified").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  online_status: boolean("online_status").default(false).notNull(),
});

export const oauth_accounts = pgTable(
  "oauth_accounts",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 50 }).notNull(),
    provider_account_id: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    access_token: varchar("access_token", { length: 1024 }),
    refresh_token: varchar("refresh_token", { length: 1024 }),
    scope: varchar("scope", { length: 512 }),
    token_type: varchar("token_type", { length: 50 }),
    expires_at: timestamp("expires_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.provider_account_id] }),
  }),
);

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(), // Changed to serial for auto-increment
  pet_name: varchar("pet_name", { length: 256 }).notNull(),
  pet_level: integer("pet_level").notNull().default(1),
  pet_happiness: integer("pet_happiness").notNull().default(50),
  pet_status: varchar("pet_status", { length: 256 })
    .notNull()
    .default("healthy"),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const forums = pgTable("forums", {
  id: serial("id").primaryKey(), // Changed to serial
  topic: varchar("topic", { length: 256 }).notNull(), // Renamed from topics to topic
  description: text("description"), // Changed to text for longer descriptions
  popular_rank: integer("popular_rank").default(0),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Changed to cascade
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  // Changed table name to snake_case
  id: serial("id").primaryKey(), // Changed to serial
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  date_posted: timestamp("date_posted", { withTimezone: true }).defaultNow(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  user_id: uuid("user_id") // Added user_id to track post author
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  forum_id: integer("forum_id") // Changed to integer to match forums.id
    .notNull()
    .references(() => forums.id, { onDelete: "cascade" }),
});

export const forumComments = pgTable("forum_comments", {
  // Changed table name
  id: serial("id").primaryKey(), // Changed to serial
  content: text("content").notNull(), // Changed from title/description to content
  date_created: timestamp("date_created", { withTimezone: true }).defaultNow(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  forum_post_id: integer("forum_post_id") // Changed to integer
    .notNull()
    .references(() => forumPosts.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
