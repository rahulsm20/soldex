/**
 * Prefill the database with transactions from the last 24 hours
 *
 * This is useful for testing and development purposes
 */

//------------------------------------------------------------------------------

import { db } from "shared/drizzle/db";
import { solanaClient } from "shared/lib/sol"
import { solana_transactions } from "shared/drizzle/schema";

//------------------------------------------------------------------------------

async function main() {
  console.log("Prefilling...");
  const signatures = await db.select().from(solana_transactions);
  console.log(`Found ${signatures.length} transactions`);

  const txs = await solanaClient.getTransactions(undefined, null, undefined, signatures.map(({ id }) => id))

  for (const tx of txs) {
    console.log({ tx })
  }
  return process.exit(0);
}

main();
