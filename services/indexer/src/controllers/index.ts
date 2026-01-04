import { solanaClient } from "@/lib/sol";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "shared/drizzle/db";
import {
  solana_indexer_state,
  solana_transactions,
} from "shared/drizzle/schema";

export const transactionsController = {
  getTransactionsForAddress: async (req: Request, res: Response) => {
    const address = req.params.address;
    if (!address)
      return res.status(400).json({ message: "Address parameter is required" });
    try {
      const last_indexed_state = await db
        .select()
        .from(solana_indexer_state)
        .where(eq(solana_indexer_state.address, address))
        .limit(1);
      let cursor: string | null = null;

      if (last_indexed_state.length)
        cursor = last_indexed_state?.[0]?.lastProcessedSignature;

      const transactions = await solanaClient.getTransactions(address, cursor);
      for (const tx of transactions) {
        if (!tx) continue;
        await db.insert(solana_transactions).values({
          address: address,
          signature: tx.transaction.signatures[0],
          slot: tx.slot,
          blockTime: tx.blockTime || null,
        });
      }

      // update last indexed signature in db
      if (transactions.length > 0) {
        const lastTx = transactions[transactions.length - 1];
        if (lastTx) {
          const lastSignature = lastTx.transaction.signatures[0];
          const existingState = await db
            .select()
            .from(solana_indexer_state)
            .where(eq(solana_indexer_state.address, address))
            .limit(1);
          if (existingState.length) {
            await db
              .update(solana_indexer_state)
              .set({ lastProcessedSignature: lastSignature })
              .where(eq(solana_indexer_state.address, address));
          } else {
            await db.insert(solana_indexer_state).values({
              address: address,
              lastProcessedSignature: lastSignature,
            });
          }
        }
      }
      return res.status(200).json({ message: "Success", transactions });
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        return res
          .status(400)
          .json({ message: "Server error", error: err.message });
      }
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  },
  indexTransaction: async (req: Request, res: Response) => {
    // TODO: Implement transaction indexing logic
    console.log({ event: req.body });
    return res.status(200).json({ message: "Webhook ack" });
  },
};
