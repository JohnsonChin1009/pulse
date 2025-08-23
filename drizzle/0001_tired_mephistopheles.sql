CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"achievement_title" varchar(256) NOT NULL,
	"achievement_description" text,
	"achievement_score" integer DEFAULT 0,
	"achievement_icon" text,
	"leaderboard_id" serial NOT NULL,
	"quest_id" serial NOT NULL
);

CREATE TABLE "leaderboards" (
	"id" serial PRIMARY KEY NOT NULL,
	"highest_level" integer DEFAULT 0,
	"highest_score_cumulative" integer DEFAULT 0,
	"hightest_most_achievement" integer DEFAULT 0,
	"user_id" uuid NOT NULL
);

CREATE TABLE "practitioners" (
	"id" serial PRIMARY KEY NOT NULL,
	"license_url" text NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now(),
	"status" varchar(50) DEFAULT 'pending',
	"user_id" uuid NOT NULL
);

CREATE TABLE "quest_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now(),
	"completion_status" varchar(50),
	"quest_id" serial NOT NULL,
	"user_id" uuid NOT NULL
);

CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"points_awarded" integer DEFAULT 0,
	"available_date" timestamp with time zone,
	"last_updated_at" timestamp with time zone DEFAULT now(),
	"expiration_date" timestamp with time zone,
	"difficulty_level" varchar(50)
);

ALTER TABLE "users" ALTER COLUMN "online_status" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "suspension_status" boolean DEFAULT false;
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_leaderboard_id_leaderboards_id_fk" FOREIGN KEY ("leaderboard_id") REFERENCES "public"."leaderboards"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "quest_completions" ADD CONSTRAINT "quest_completions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "quest_completions" ADD CONSTRAINT "quest_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;