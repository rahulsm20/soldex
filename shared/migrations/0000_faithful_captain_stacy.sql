CREATE TABLE "solana_indexer_state" (
	"id" uuid PRIMARY KEY NOT NULL,
	"last_processed_slot" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solana_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"signature" text,
	"slot" integer NOT NULL,
	"block_time" integer,
	"data" json
);
