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
  "token_mint",
]);

export const solana_transactions = pgTable("solana_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address"),
  signature: text("signature").unique().notNull(),
  blockTime: timestamp("block_time"),
  from_address: text("from_address"),
  to_address: text("to_address"),
  from_addresses: text("from_addresses")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  to_addresses: text("to_addresses")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
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

export const AlertTypeEnum = pgEnum("alert_type", ['price_change', 'market_cap_change']);
export const AlertChangeTypeEnum = pgEnum("alert_change_type", ['increase', 'decrease']);
export const AlertChangeUnitEnum = pgEnum("alert_change_unit", ['percent', 'dollars']);
export const AlertActionTypeEnum = pgEnum("alert_action_type", ['sell', 'buy']);
export const IntegrationTypeEnum = pgEnum("integration_type", ['telegram', 'discord', 'email']);

export const Alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: AlertTypeEnum("type").notNull(),
  changeType: AlertChangeTypeEnum("change_type").notNull(),
  changeUnit: AlertChangeUnitEnum("change_unit").notNull(),
  changeValue: doublePrecision("change_value"),
  actionType: AlertActionTypeEnum("action_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  authProvider: text("auth_provider").notNull(),
  sub: text("sub").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});


export const IntegrationAuths = pgTable("integration_auths", {
  id: uuid("id").primaryKey().defaultRandom(),
  integration: IntegrationTypeEnum('integration').notNull(),
  userId: uuid("user_id").notNull().references(() => Users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

//--------------------------------------------------------
