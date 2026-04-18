ALTER TABLE "solana_transactions" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" ALTER COLUMN "block_time" DROP NOT NULL;