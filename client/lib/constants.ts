export const ACCOUNTS_SIGS = {
  USDC_MINT_MULTISIG: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
  USDT_MINT_MULTISIG: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
  PUMP_FUN: "Doa8F9eugaAHpCBmfmShKV1BhKN9xyaEDg1mTsonW5p8",
};

export const ACCOUNTS = [
  {
    label: "USDC Mint Authority",
    value: "usdc_mint_auth",
    sig: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
    color: "var(--chart-1)",
  },
  {
    label: "Pump Fun Account",
    value: "pump_fun",
    sig: "Doa8F9eugaAHpCBmfmShKV1BhKN9xyaEDg1mTsonW5p8",
    color: "var(--chart-2)",
  },
  {
    label: "USDT Mint Authority",
    value: "usdt_mint_auth",
    sig: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
    color: "var(--chart-3)",
  },
];

export const colors = {
  primary: {
    text: "text-purple-400",
    bg: "bg-purple-400",
    border: "border-purple-400",
  },
};
