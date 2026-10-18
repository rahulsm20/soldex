import { relations, sql } from "drizzle-orm";
import {
  bigint,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod"
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

export const alertTypeEnum = pgEnum("alert_type", ['price_change', 'market_cap_change']);
export const alertChangeTypeEnum = pgEnum("alert_change_type", ['increase', 'decrease']);
export const alertChangeUnitEnum = pgEnum("alert_change_unit", ['percent', 'dollars']);
export const alertActionTypeEnum = pgEnum("alert_action_type", ['sell', 'buy']);
export const integrationTypeEnum = pgEnum("integration_type", ['telegram', 'discord', 'email']);

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: text("token_id").notNull(),
  type: alertTypeEnum("type").notNull(),
  changeType: alertChangeTypeEnum("change_type").notNull(),
  changeUnit: alertChangeUnitEnum("change_unit").notNull(),
  changeValue: doublePrecision("change_value"),
  actionType: alertActionTypeEnum("action_type"),
  actionUnit: alertChangeUnitEnum("action_unit"),
  actionValue: doublePrecision("action_value"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const alertInsertSchema = createInsertSchema(alerts);
export const users = pgTable("users", {
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

export const usertsInsertSchema = createInsertSchema(users);

export const integrationAuths = pgTable("integration_auths", {
  id: uuid("id").primaryKey().defaultRandom(),
  integration: integrationTypeEnum('integration').notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const userAlerts = pgTable(
  "user_alerts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    alertId: uuid("alert_id")
      .notNull()
      .references(() => alerts.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.alertId],
    }),
  ],
);
export const usersRelations = relations(users, ({ many }) => ({
  alerts: many(alerts),
}));

export const alertsRelations = relations(alerts, ({ many }) => ({
  user: many(users),
}));

//--------------------------------------------------------
