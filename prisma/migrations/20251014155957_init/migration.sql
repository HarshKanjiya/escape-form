-- CreateEnum
CREATE TYPE "form_status" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "response_status" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED', 'PARTIAL');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(30) NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "google_id" TEXT,
    "profile_picture" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "owner_id" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "team_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "project_id" UUID NOT NULL,
    "theme" TEXT,
    "logo_url" TEXT,
    "welcome_screen" JSONB,
    "thank_you_screen" JSONB,
    "multiple_submissions" BOOLEAN,
    "max_responses" INTEGER,
    "type" TEXT,
    "open_at" TIMESTAMPTZ,
    "close_at" TIMESTAMPTZ,
    "password_protected" BOOLEAN,
    "password_hash" TEXT,
    "status" "form_status",
    "require_consent" BOOLEAN,
    "analytics_enabled" BOOLEAN,
    "unique_subdomain" TEXT,
    "custom_domain" TEXT,
    "config" JSONB,
    "allow_anonymous" BOOLEAN,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "user_id" TEXT,
    "response_data" JSONB NOT NULL,
    "status" "response_status",
    "started_at" TIMESTAMPTZ,
    "submitted_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "partial_save" BOOLEAN,
    "files" JSONB,
    "notified" BOOLEAN,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referrer_url" TEXT,
    "tags" TEXT[],

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
