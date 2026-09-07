CREATE TYPE "public"."alert_change_type" AS ENUM('increase', 'decrease');--> statement-breakpoint
CREATE TYPE "public"."alert_change_unit" AS ENUM('percent', 'dollars');--> statement-breakpoint
CREATE TYPE "public"."alert_type" AS ENUM('price_change', 'market_cap_change');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "alert_type" NOT NULL,
	"change_type" "alert_change_type" NOT NULL,
	"change_unit" "alert_change_unit" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"auth_provider" text NOT NULL,
	"sub" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
