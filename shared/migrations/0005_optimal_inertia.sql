ALTER TABLE "solana_indexer_state" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_indexer_state" ADD COLUMN "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD COLUMN "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL;