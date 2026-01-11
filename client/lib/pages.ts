export const TransactionsPage = {
  href: "/transactions",
  name: "Transactions",
};

export const ExternalLinks = {
  solscan: (type: "address" | "tx" | "account" | "token", address: string) => {
    switch (type) {
      case "token":
        return `https://solscan.io/token/${address}`;
      case "account":
        return `https://solscan.io/account/${address}`;
      case "address":
        return `https://solscan.io/address/${address}`;
      case "tx":
        return `https://solscan.io/tx/${address}`;
      default:
        return `https://solscan.io/`;
    }
  },
};
