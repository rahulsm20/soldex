export const ACCOUNTS_SIGS = {
  USDC_MINT_MULTISIG: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
  USDT_MINT_MULTISIG: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
  TRUMP_UPDATE_AUTH: "5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7",
};

export const ACCOUNTS = [
  {
    label: "USDC",
    value: "usdc_mint_auth",
    sig: "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
    color: "var(--chart-1)",
    icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vectors/usdc-fpxuadmgafrjjy85bgie5.png/usdc-kksfxcrdl3f9pjx0v6jxxp.png?_a=DATAg1AAZAA0",
  },
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

export const TOKENS = [
  {
    label: "SOL",
    value: "sol",
    sig: "So11111111111111111111111111111111111111112",
  },
  {
    label: "USDC",
    value: "usdc",
    sig: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    label: "USDT",
    value: "usdt",
    sig: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    color: "var(--chart-3)",
  },
  {
    label: "TRUMP",
    value: "trump",
    sig: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
  },
  {
    label: "PUMP",
    value: "pump",
    sig: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
    color: "var(--chart-5)",
  },
  {
    label: "Jupiter",
    value: "jupiter",
    sig: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  },
  {
    label: "JITO",
    value: "jito",
    sig: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
  },
];

export const ACCOUNTS_MAP: { [sig: string]: string } = ACCOUNTS.reduce(
  (acc, curr) => {
    acc[curr.sig] = curr.label;
    return acc;
  },
  {} as { [sig: string]: string },
);

export const CACHE_KEYS = {
  TRANSACTIONS: (...args: (string | number)[]) =>
    `transactions:${args.join(":")}`,
  TOKEN_PRICE: (tokenAddress: string) => `token_price:${tokenAddress}`,
  CHART_DATA: (...args: (string | number)[]) =>
    `soldex_chart_data:${args.join(":")}`,
};

export const LOGO_URL = "https://soldex-seven.vercel.app/book-open-check.png";
