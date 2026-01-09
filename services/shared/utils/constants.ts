export const ACCOUNTS_SIGS = {
  USDC_MINT_MULTISIG: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
  USDT_MINT_MULTISIG: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
  PUMP_FUN: "Doa8F9eugaAHpCBmfmShKV1BhKN9xyaEDg1mTsonW5p8",
};

export const CACHE_KEYS = {
  TRANSACTIONS: (page?: number, pageSize?: number) =>
    `transactions:${page}:${pageSize}`,
};
