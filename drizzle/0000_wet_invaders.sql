CREATE TABLE "forum_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"date_created" timestamp with time zone DEFAULT now(),
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"forum_post_id" integer NOT NULL,
	"user_id" uuid NOT NULL
);

CREATE TABLE "forum_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"date_posted" timestamp with time zone DEFAULT now(),
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"user_id" uuid NOT NULL,
	"forum_id" integer NOT NULL
);

CREATE TABLE "forums" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" varchar(256) NOT NULL,
	"description" text,
	"popular_rank" integer DEFAULT 0,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_name" varchar(256) NOT NULL,
	"pet_level" integer DEFAULT 1 NOT NULL,
	"pet_happiness" integer DEFAULT 50 NOT NULL,
	"pet_status" varchar(256) DEFAULT 'healthy' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"profile_picture_url" text,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"gender" varchar(10),
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_forum_post_id_forum_posts_id_fk" FOREIGN KEY ("forum_post_id") REFERENCES "public"."forum_posts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_forum_id_forums_id_fk" FOREIGN KEY ("forum_id") REFERENCES "public"."forums"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "forums" ADD CONSTRAINT "forums_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;