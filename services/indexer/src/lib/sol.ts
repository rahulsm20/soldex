import { config } from "@/utils/config";
import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
  SignaturesForAddressOptions,
} from "@solana/web3.js";

//----------------------------------------------

interface GetAccountInfoResult {
  value: unknown;
}

/**
 * SolanaClientClass interacts with the Helius API to fetch Solana account information.
 * It uses the Helius API key from the configuration.
 * Methods:
 * - getAccountInfo(address: string): Fetches account information for the given Solana address.
 * /
 */
class SolanaClientClass {
  private readonly client: Connection;
  constructor(options?: { apiKey?: string; fetcher?: typeof fetch }) {
    const apiKey = options?.apiKey ?? config.HELIUS_API_KEY;
    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    if (!apiKey) {
      throw new Error("Helius API key is required");
    }

    this.client = new Connection(url, "confirmed");
  }

  async getAccountInfo(address: string): Promise<GetAccountInfoResult> {
    const key = new PublicKey(address);
    const response = await this.client.getAccountInfo(key);
    return { value: response };
  }

  async getSignatures(
    address: string,
    cursor?: string | null
  ): Promise<ConfirmedSignatureInfo[]> {
    const key = new PublicKey(address);
    const opts: SignaturesForAddressOptions = {
      limit: 10,
    };
    if (cursor) opts.before = cursor;
    const response = await this.client.getSignaturesForAddress(key, opts);
    return response;
  }

  async getTransactions(
    address: string,
    cursor?: string | null
  ): Promise<(ParsedTransactionWithMeta | null)[]> {
    const signatures = await this.getSignatures(address, cursor);
    if (!signatures || signatures.length === 0) {
      return [];
    }
    const transactions = [];
    for (const sig of signatures) {
      const tx = await this.client.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });
      transactions.push(tx);
    }

    return transactions;
  }
}

export const solanaClient = new SolanaClientClass({
  apiKey: config.HELIUS_API_KEY,
});
