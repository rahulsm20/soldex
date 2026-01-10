ALTER TABLE "solana_tokens" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_tokens" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "solana_tokens" ADD COLUMN "price_change_24h" integer;--> statement-breakpoint
ALTER TABLE "solana_tokens" ADD CONSTRAINT "solana_tokens_address_unique" UNIQUE("address");