import { config } from "@/utils/config";

//----------------------------------------------

interface RpcRequest<TParams = unknown> {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params: TParams;
}

interface RpcResponse<TResult> {
  jsonrpc: "2.0";
  id: number;
  result?: TResult;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

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
  private readonly HeliusApiKey: string = config.HELIUS_API_KEY || "";
  private readonly url: string = `https://mainnet.helius-rpc.com?api-key=${this.HeliusApiKey}`;
  private readonly fetcher: typeof fetch;
  constructor(options?: { apiKey?: string; fetcher?: typeof fetch }) {
    const apiKey = options?.apiKey ?? config.HELIUS_API_KEY;

    if (!apiKey) {
      throw new Error("Helius API key is required");
    }

    this.url = `https://mainnet.helius-rpc.com?api-key=${apiKey}`;
    this.fetcher = options?.fetcher ?? fetch;
  }

  async getAccountInfo(address: string): Promise<GetAccountInfoResult> {
    const request: RpcRequest<[string, { encoding: string }]> = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "getAccountInfo",
      params: [address, { encoding: "jsonParsed" }],
    };

    const response = await this.fetcher(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data: RpcResponse<GetAccountInfoResult> = await response.json();

    if (data.error) {
      throw new Error(`RPC error ${data.error.code}: ${data.error.message}`);
    }

    if (!data.result) {
      throw new Error("Empty RPC result");
    }

    return data.result;
  }
}

export const solanaClient = new SolanaClientClass({
  apiKey: config.HELIUS_API_KEY,
});
