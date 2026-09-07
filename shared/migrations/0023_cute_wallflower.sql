CREATE TYPE "public"."alert_action_type" AS ENUM('sell', 'buy');--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "change_value" double precision;--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "action_type" "alert_action_type";