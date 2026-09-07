CREATE TYPE "public"."integration_type" AS ENUM('telegram', 'discord', 'email');--> statement-breakpoint
CREATE TABLE "integration_auths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration" "integration_type" NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_auths" ADD CONSTRAINT "integration_auths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;