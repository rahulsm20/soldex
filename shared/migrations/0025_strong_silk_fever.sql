ALTER TABLE "alerts" ADD COLUMN "token_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "action_unit" "alert_change_unit";--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "action_value" double precision;