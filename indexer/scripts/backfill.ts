import { solanaClient } from "@/indexer/src/lib/sol";
import { extractFromAndToAddresses } from "@/indexer/src/utils";
import { db } from "@/shared/drizzle/db";
import { solana_transactions } from "@/shared/drizzle/schema";
import { ParsedInstruction } from "@solana/web3.js";
import { sleep } from "bun";
import { eq, isNull, or } from "drizzle-orm";

async function backfill() {
  const start = Date.now();
  let offset = 0;
  while (true) {
    const raw_txs = await db
      .select()
      .from(solana_transactions)
      .limit(10)
      .orderBy(solana_transactions.id)
      .offset(offset)
      .where(
        or(
          isNull(solana_transactions.to_address),
          isNull(solana_transactions.from_address),
        ),
      );
    if (raw_txs.length === 0) {
      console.log("No more transactions to backfill.");
      break;
    }
    const txs = await solanaClient.getTransactions(
      undefined,
      undefined,
      undefined,
      raw_txs.map((tx) => tx.signature),
    );

    for (const tx of txs) {
      if (!tx) continue;
      const mintInstruction = tx.transaction.message.instructions.find(
        (inst) => {
          const data = inst as ParsedInstruction;
          return (
            data?.parsed?.type === "mintTo" ||
            data?.parsed?.type === "transfer" ||
            data?.parsed?.type === "transferChecked"
          );
        },
      ) as ParsedInstruction | undefined;
      if (!mintInstruction) {
        continue;
      }
      const { to_address, from_address } = extractFromAndToAddresses(tx, "");
      if (!to_address) {
        continue;
      }
      await db
        .update(solana_transactions)
        .set({
          to_address,
          from_address,
        })
        .where(eq(solana_transactions.signature, tx.transaction.signatures[0]));
    }
    await sleep(2000);
    offset += raw_txs.length;
    console.log("Processed batch: ", raw_txs.map((t) => t.id).join(", "));
  }
  const end = Date.now();
  const timetaken = (end - start) / 1000;
  console.log(
    "Backfill completed.",
    new Date().toISOString(),
    `timeTaken: ${timetaken}s`,
  );
}

backfill();
