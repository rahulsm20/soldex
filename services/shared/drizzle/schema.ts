import { sql } from "drizzle-orm";
import {
  bigint,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

//--------------------------------

export const TransactionTypeEnum = pgEnum("transaction_type", [
  "transfer",
  "contract_call",
  "stake",
  "unstake",
  "mint",
  "reward",
]);

export const solana_transactions = pgTable("solana_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull(),
  signature: text("signature").unique().notNull(),
  blockTime: timestamp("block_time").notNull(),
  from_address: text("from_address"),
  to_address: text("to_address"),
  slot: bigint("slot", { mode: "number" }).notNull(),
  lamports: bigint("lamports", { mode: "number" }),
  transaction_type: TransactionTypeEnum("transaction_type").default("transfer"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const solana_indexer_state = pgTable("solana_indexer_state", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull().unique(),
  lastProcessedSignature: text("last_processed_signature").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const solana_tokens = pgTable("solana_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull().unique(),
  name: text("name"),
  symbol: text("symbol"),
  decimals: integer("decimals"),
  icon: text("icon"),
  price: doublePrecision("price"),
  priceChange24h: doublePrecision("price_change_24h"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

//--------------------------------------------------------
