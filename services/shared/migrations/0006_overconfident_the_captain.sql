ALTER TABLE "solana_transactions" ALTER COLUMN "signature" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_indexer_state" ADD COLUMN "last_processed_signature" text NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_indexer_state" DROP COLUMN "last_processed_slot";--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD CONSTRAINT "solana_transactions_signature_unique" UNIQUE("signature");