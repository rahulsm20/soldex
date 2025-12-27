import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
//--------------------------------

/** 
    This file defines the database schema using Drizzle ORM.
    Sample table definition for a 'users' table is provided below.
    You can add more tables as needed following the same pattern.
*/
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
});
