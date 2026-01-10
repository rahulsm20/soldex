import { config } from "@/utils/config";
import { db } from "shared/drizzle/db";
import { solana_tokens } from "shared/drizzle/schema";
import { cacheData, getCachedData } from "shared/redis";
import { CACHE_KEYS } from "shared/utils/constants";
import { TokenPriceResponse } from "types";

export interface ApiClientOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  getAuthToken?: () => string | null;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private getAuthToken?: () => string | null;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.getAuthToken = options.getAuthToken;
  }

  private buildHeaders(extraHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...extraHeaders,
    });
    const token = this.getAuthToken?.();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  private buildUrl(path: string, query?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}/${path.replace(/^\/+/, "")}`);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      query?: Record<string, any>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const response = await fetch(this.buildUrl(path, options.query), {
      method,
      headers: this.buildHeaders(options.headers),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error ${response.status}: ${errorText || response.statusText}`
      );
    }

    // Handle empty responses (204, etc.)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // Public helpers

  get<T>(path: string, query?: Record<string, any>) {
    return this.request<T>("GET", path, { query });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>("POST", path, { body });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>("PUT", path, { body });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>("PATCH", path, { body });
  }

  delete<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}

const jupiterClient = new ApiClient({
  baseUrl: "https://api.jup.ag",
  defaultHeaders: {
    "x-api-key": config.JUPITER_API_KEY,
  },
});
export async function getTokenData(ids: string[]) {
  const response = await jupiterClient.get<
    {
      id: string;
      name: string;
      symbol: string;
      decimals: number;
      icon: string;
    }[]
  >(`/tokens/v2/search`, {
    query: ids.join(","),
  });

  return response;
}

export async function getTokenPrice(
  ids: string[]
): Promise<TokenPriceResponse[]> {
  const cacheKey = CACHE_KEYS.TOKEN_PRICE(ids.join(","));
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const prices = await jupiterClient.get<
    Record<
      string,
      {
        createdAt: string;
        liquidity: number;
        usdPrice: number;
        blockId: number;
        decimals: number;
        priceChange24h: number;
      }
    >
  >(`/price/v3`, {
    ids: ids.join(","),
  });

  const info = await getTokenData(ids);
  const data: TokenPriceResponse[] = [];
  for (const id of ids) {
    const tokenInfo = info?.find((t) => t.id === id);
    const tokenPrice = prices[id];
    if (tokenInfo && tokenPrice) {
      tokenPrice.decimals = tokenInfo.decimals;
    }
    const [insertedToken] = await db
      .insert(solana_tokens)
      .values({
        address: id,
        name: tokenInfo?.name,
        symbol: tokenInfo?.symbol,
        decimals: tokenInfo?.decimals,
        icon: tokenInfo?.icon,
        price: Math.floor(tokenPrice.usdPrice * 100),
        priceChange24h: Math.floor(tokenPrice.priceChange24h * 100),
      })
      .onConflictDoUpdate({
        target: solana_tokens.address,
        set: {
          name: tokenInfo?.name,
          symbol: tokenInfo?.symbol,
          decimals: tokenInfo?.decimals,
          icon: tokenInfo?.icon,
          price: Math.floor(tokenPrice.usdPrice * 100),
          priceChange24h: Math.floor(tokenPrice.priceChange24h * 100),
        },
      })
      .returning({
        id: solana_tokens.id,
        address: solana_tokens.address,
        name: solana_tokens.name,
        symbol: solana_tokens.symbol,
        decimals: solana_tokens.decimals,
        icon: solana_tokens.icon,
        price: solana_tokens.price,
        priceChange24h: solana_tokens.priceChange24h,
      });
    data.push(insertedToken);
  }
  const HOUR_IN_SECONDS = 3600;
  await cacheData(cacheKey, JSON.stringify(data), HOUR_IN_SECONDS); // Cache for 5 minutes
  return data;
}
