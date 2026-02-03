import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";
import fetch from "node-fetch";
import { db } from "../../shared/drizzle/db";
import {
  solana_indexer_state,
  solana_transactions,
} from "../../shared/drizzle/schema";
import { ACCOUNTS } from "../../shared/utils/constants";
import { solanaClient } from "../src/lib/sol";
import { extractFromAndToAddresses, getTransactionType } from "../src/utils";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

async function getSignaturesForAddress(
  address: string,
  beforeSignature = null,
  limit = 1000,
) {
  const params: { limit: number; commitment: string; before?: string | null } =
    {
      limit,
      commitment: "confirmed",
    };

  if (beforeSignature) {
    params.before = beforeSignature;
  }

  const response = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [address, params],
    }),
  });

  const data = await response.json();
  return data.result || [];
}

async function getParsedTransactions(signatures) {
  const response = await solanaClient.getTransactions(
    undefined,
    null,
    undefined,
    signatures,
  );

  return response;
}

async function getEnhancedTransactions(signatures) {
  // Helius enhanced transactions endpoint (batch)
  const response = await fetch(
    `https://api.helius.xyz/v0/transactions?api-key=${HELIUS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactions: signatures,
      }),
    },
  );

  return await response.json();
}

async function fetchTransactionsForPeriod(
  address: string,
  days = 30,
  beforeSignature?: string,
) {
  const cutoffTime = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
  let allTransactions: ParsedTransactionWithMeta[] = [];
  // let beforeSignature = null;
  let hasMore = true;
  let totalFetched = 0;

  // console.log(
  //   `Fetching transactions for ${address} from the past ${days} days...`,
  // );
  // console.log(
  //   `Cutoff timestamp: ${new Date(cutoffTime * 1000).toISOString()}\n`,
  // );

  while (hasMore && totalFetched < 500) {
    // Get signatures with pagination
    const signatures = await getSignaturesForAddress(address, beforeSignature);

    if (signatures.length === 0) {
      hasMore = false;
      break;
    }

    // Filter by time
    const recentSignatures = signatures.filter(
      (sig) => sig.blockTime >= cutoffTime,
    );

    if (recentSignatures.length === 0) {
      hasMore = false;
      break;
    }

    totalFetched += recentSignatures.length;
    // console.log(
    //   `Fetched ${recentSignatures.length} signatures (total: ${totalFetched})`,
    //   // { recentSignatures },
    // );

    // Process in batches of 100 for enhanced transactions
    const batchSize = 10;
    for (let i = 0; i < recentSignatures.length; i += batchSize) {
      const batch = recentSignatures.slice(i, i + batchSize);
      const sigs = batch.map((s) => s.signature);

      try {
        // Use Helius enhanced transactions API for parsed data
        const transactions = await getParsedTransactions(sigs);
        allTransactions.push(...(transactions || []));

        // console.log(
        //   `Processed batch ${Math.floor(i / batchSize) + 1} (${
        //     sigs.length
        //   } transactions)`,
        // );

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error fetching batch: ${error.message}`);
      }
    }

    // Check if we should continue pagination
    const oldestSignature = signatures[signatures.length - 1];
    if (oldestSignature.blockTime < cutoffTime) {
      hasMore = false;
    } else {
      beforeSignature = oldestSignature.signature;
    }
    if (beforeSignature) {
      // update before signature for next iteration
      await db
        .insert(solana_indexer_state)
        .values({
          address,
          lastProcessedSignature: beforeSignature,
          updated_at: new Date(),
        })
        .onConflictDoUpdate({
          target: solana_indexer_state.address,
          set: {
            lastProcessedSignature: beforeSignature,
            updated_at: new Date(),
          },
        });
    }

    // If we got fewer results than the limit, we've reached the end
    if (signatures.length < 1000) {
      hasMore = false;
    }
  }

  return allTransactions;
}

// // Alternative: Using Helius Webhook/History API
// async function fetchUsingHeliusHistory(address, days = 30) {
//   const beforeTime = Math.floor(Date.now() / 1000);
//   const afterTime = beforeTime - days * 24 * 60 * 60;

//   const response = await fetch(
//     `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`,
//     {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     },
//   );

//   return await response.json();
// }

async function main() {
  const now = new Date().valueOf();

  const sigs = ACCOUNTS.map((acc) => acc.sig);
  for (const targetAddress of sigs) {
    if (!HELIUS_API_KEY) {
      console.error("Error: HELIUS_API_KEY environment variable not set");
      process.exit(1);
    }

    try {
      const existingState = await db
        .select()
        .from(solana_indexer_state)
        .where(eq(solana_indexer_state.address, targetAddress));

      const transactions = await fetchTransactionsForPeriod(
        targetAddress,
        30,
        existingState?.[0]?.lastProcessedSignature,
      );

      console.log(`\nTotal transactions fetched: ${transactions.length}`);

      const filteredTransactions = transactions.filter(
        (tx) => getTransactionType(tx) !== "UNKNOWN",
      );
      console.log(
        `Total valid transactions to save: ${filteredTransactions.length}`,
      );

      // TODO: Use batch inserts for better performance
      //     const batchResponse: BatchResponse = await db.batch([
      // 	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
      // 	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
      // 	db.query.usersTable.findMany({}),
      // 	db.select().from(usersTable).where(eq(usersTable.id, 1)),
      // 	db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
      // ]);
      const inserts: BatchItem<"pg">[] = [];
      for (const tx of transactions) {
        const { to_address, from_address } = extractFromAndToAddresses(tx, "");
        const toSave: typeof solana_transactions.$inferInsert = {
          address: targetAddress,
          from_address,
          to_address,
          signature: tx.transaction.signatures[0],
          blockTime: new Date(tx?.blockTime * 1000),
          slot: tx?.slot,
        };

        try {
          inserts.push(
            db
              .insert(solana_transactions)
              .values(toSave)
              .onConflictDoUpdate({
                target: solana_transactions.signature,
                set: {
                  address: toSave.address,
                  from_address: toSave.from_address,
                  blockTime: toSave.blockTime,
                  to_address: toSave.to_address,
                  slot: toSave.slot,
                  updated_at: new Date(),
                },
              }),
          );
        } catch (error) {
          console.error("Error inserting transaction:", toSave);
          console.error("Full error:", error);
          console.error("Error message:", error.message);
          console.error("Error code:", error.code);
          console.error("Error detail:", error.detail);
        }
      }
      if (inserts.length > 0) {
        const typedInserts = inserts as [BatchItem<"pg">];
        await db.batch(typedInserts);
        // console.log("\nSample transaction structure:");
        // console.log(
        //   JSON.stringify(transactions[0], null, 2).substring(0, 500) + "...",
        // );

        // console.log(JSON.stringify(batchresponse, null, 2));
      } else {
        console.log("No new transactions to insert.");
      }
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const end = new Date().valueOf();
  const timeTaken = (end - now) / 1000;
  console.log(`\nScript completed in ${timeTaken}s`);
}

main();
