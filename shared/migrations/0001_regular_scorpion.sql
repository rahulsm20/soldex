ALTER TABLE "solana_indexer_state" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_indexer_state" ADD CONSTRAINT "solana_indexer_state_address_unique" UNIQUE("address");