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
  private readonly apiKey: string;
  constructor(options?: { apiKey?: string; fetcher?: typeof fetch }) {
    const apiKey = options?.apiKey ?? config.HELIUS_API_KEY;
    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    if (!apiKey) {
      throw new Error("Helius API key is required");
    }
    this.apiKey = apiKey;

    this.client = new Connection(url, "confirmed");
  }

  async getAccountInfo(address: string): Promise<GetAccountInfoResult> {
    const key = new PublicKey(address);
    const response = await this.client.getAccountInfo(key);
    return { value: response };
  }

  async getSignatures(
    address: string,
    cursor?: string | null,
    limit?: number,
    before?: number // unix timestamp
  ): Promise<ConfirmedSignatureInfo[]> {
    const key = new PublicKey(address);
    const opts: SignaturesForAddressOptions = {};
    if (cursor) opts.before = cursor;
    if (limit) opts.limit = limit;
    // if(before) opts.
    const response = await this.client.getSignaturesForAddress(key, opts);
    return response;
  }

  async getTransactions(
    address?: string,
    cursor?: string | null,
    limit?: number,
    signaturesToFind?: string[]
  ): Promise<(ParsedTransactionWithMeta | null)[]> {
    let signatures: ConfirmedSignatureInfo[] | string[] = [];
    const transactions = [];
    if (signaturesToFind && signaturesToFind.length > 0) {
      signatures = signaturesToFind;
    } else {
      if (!address) return [];
      signatures = await this.getSignatures(address, cursor, limit);
      if (!signatures || signatures.length === 0) {
        return [];
      }
    }
    for (const sig of signatures) {
      const tx = await this.client.getParsedTransaction(
        typeof sig === "string" ? sig : sig.signature,
        {
          maxSupportedTransactionVersion: 0,
        }
      );
      transactions.push(tx);
    }
    return transactions;
  }

  async getTransactionsForAddress(
    address?: string,
    cursor?: string | null,
    limit?: number,
    signaturesToFind?: string[]
  ): Promise<(ParsedTransactionWithMeta | null)[]> {
    const data = fetch(
      `https://api-mainnet.helius-rpc.com/v0/addresses/${address}/transactions?api-key=${this.apiKey}`
    );

    return [];
  }
}

export const solanaClient = new SolanaClientClass({
  apiKey: config.HELIUS_API_KEY,
});
