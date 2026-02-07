CREATE TABLE "solana_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mint_address" text NOT NULL,
	"name" text,
	"symbol" text,
	"decimals" integer,
	"price" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "solana_tokens_mint_address_unique" UNIQUE("mint_address")
);
