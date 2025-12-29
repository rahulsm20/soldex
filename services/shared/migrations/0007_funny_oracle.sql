ALTER TABLE "solana_transactions" ADD COLUMN "from_address" text;--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD COLUMN "to_address" text;--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD COLUMN "lamports" integer;