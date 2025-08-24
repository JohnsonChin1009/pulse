-- Local Usage (Will Update Accordingly)

-- USER TABLE
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password TEXT,
    profile_picture_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    gender VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    online_status BOOLEAN DEFAULT FALSE,
    suspension_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- FORUM TABLE
DROP TABLE IF EXISTS "forums" CASCADE;
CREATE TABLE "forums" (
    id SERIAL PRIMARY KEY,
    topics VARCHAR(256),
    description TEXT,
    popular_rank INTEGER DEFAULT 0,
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- FORUM POST TABLE
DROP TABLE IF EXISTS "forum_posts" CASCADE;
CREATE TABLE "forum_posts" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    date_post TIMESTAMPTZ DEFAULT now(),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    forum_id INTEGER REFERENCES "forums"(id) ON DELETE CASCADE,
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE
);

-- FORUM COMMENT TABLE
DROP TABLE IF EXISTS "forum_comments" CASCADE;
CREATE TABLE "forum_comments" (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    date_post TIMESTAMPTZ DEFAULT now(),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    forum_post_id INTEGER REFERENCES "forum_posts"(id) ON DELETE CASCADE,
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE
);

-- PET TABLE
DROP TABLE IF EXISTS "pets" CASCADE;
CREATE TABLE "pets" (
    id SERIAL PRIMARY KEY,
    pet_name VARCHAR(256) NOT NULL,
    pet_level INTEGER DEFAULT 1,
    pet_happiness INTEGER DEFAULT 50,
    pet_status VARCHAR(256) DEFAULT 'healthy',
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- LEADERBOARD TABLE
DROP TABLE IF EXISTS "leaderboards" CASCADE;
CREATE TABLE "leaderboards" (
    id SERIAL PRIMARY KEY,
    highest_level INTEGER DEFAULT 0,
    highest_score_cumulative INTEGER DEFAULT 0,
    highest_most_achievement INTEGER DEFAULT 0,
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE
);

-- QUEST TABLE
DROP TABLE IF EXISTS "quests" CASCADE;
CREATE TABLE "quests" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    available_date TIMESTAMPTZ,
    last_updated_date TIMESTAMPTZ DEFAULT now(),
    expiration_date TIMESTAMPTZ,
    difficulty_level VARCHAR(50)
);

-- QUEST COMPLETION TABLE
DROP TABLE IF EXISTS "quest_completions" CASCADE;
CREATE TABLE "quest_completions" (
    id SERIAL PRIMARY KEY,
    completed_at TIMESTAMPTZ DEFAULT now(),
    completion_status VARCHAR(50),
    quest_id INTEGER REFERENCES "quests"(id) ON DELETE CASCADE,
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE
);

-- ACHIEVEMENT TABLE
DROP TABLE IF EXISTS "achievements" CASCADE;
CREATE TABLE "achievements" (
    id SERIAL PRIMARY KEY,
    achievement_title VARCHAR(256) NOT NULL,
    achievement_description TEXT,
    achievement_score INTEGER DEFAULT 0,
    achievement_icon TEXT,
    leaderboard_id INTEGER REFERENCES "leaderboards"(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES "quests"(id) ON DELETE CASCADE
);

-- OAUTH ACCOUNTS TABLE
DROP TABLE IF EXISTS "oauth_accounts" CASCADE;
CREATE TABLE "oauth_accounts" (
    id UUID REFERENCES "users"(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    access_token VARCHAR(1024),
    refresh_token VARCHAR(1024),
    scope VARCHAR(512),
    token_type VARCHAR(50),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT oauth_accounts_provider_provider_account_id_pk PRIMARY KEY(provider, provider_account_id)
);

-- PRACTITIONER TABLE
DROP TABLE IF EXISTS "practitioners" CASCADE;
CREATE TABLE "practitioners" (
    id SERIAL PRIMARY KEY,
    license_url VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(50) DEFAULT 'pending',
    user_id UUID REFERENCES "users"(id) ON DELETE CASCADE
);
