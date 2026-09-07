CREATE TABLE "user_alerts" (
	"user_id" uuid NOT NULL,
	"alert_id" uuid NOT NULL,
	CONSTRAINT "user_alerts_user_id_alert_id_pk" PRIMARY KEY("user_id","alert_id")
);
--> statement-breakpoint
ALTER TABLE "user_alerts" ADD CONSTRAINT "user_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alerts" ADD CONSTRAINT "user_alerts_alert_id_alerts_id_fk" FOREIGN KEY ("alert_id") REFERENCES "public"."alerts"("id") ON DELETE cascade ON UPDATE no action;