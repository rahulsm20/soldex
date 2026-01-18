export const ACCOUNTS_SIGS = {
  USDC_MINT_MULTISIG: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
  USDT_MINT_MULTISIG: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
  PUMP_FUN: "Doa8F9eugaAHpCBmfmShKV1BhKN9xyaEDg1mTsonW5p8",
};

export const ACCOUNTS = [
  {
    label: "USDC",
    value: "usdc_mint_auth",
    sig: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
    color: "var(--chart-1)",
    icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vectors/usdc-fpxuadmgafrjjy85bgie5.png/usdc-kksfxcrdl3f9pjx0v6jxxp.png?_a=DATAg1AAZAA0",
  },
  // {
  //   label: "Pump Fun Account",
  //   value: "pump_fun",
  //   sig: "Doa8F9eugaAHpCBmfmShKV1BhKN9xyaEDg1mTsonW5p8",
  //   color: "var(--chart-2)",
  // },
  {
    label: "USDT",
    value: "usdt_mint_auth",
    sig: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
    color: "var(--chart-3)",
    icon: "https://www.svgrepo.com/show/367256/usdt.svg",
  },
  {
    label: "Trump",
    value: "trump_update_auth",
    sig: "5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7",
    color: "var(--chart-4)",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/35336.png",
  },
];

export const CACHE_KEYS = {
  TRANSACTIONS: (...args: (string | number)[]) =>
    `transactions:${args.join(":")}`,
  TOKEN_PRICE: (tokenAddress: string) => `token_price:${tokenAddress}`,
  CHART_DATA: (...args: (string | number)[]) =>
    `soldex_chart_data:${args.join(":")}`,
};
