import { ParsedInstruction, ParsedTransactionWithMeta } from "@solana/web3.js";

export const extractFromAndToAddresses = (
  tx: ParsedTransactionWithMeta,
  address?: string,
) => {
  const mintInstruction = tx.transaction.message.instructions.find((inst) => {
    const data = inst as ParsedInstruction;
    return (
      data?.parsed?.type === "mintTo" ||
      data?.parsed?.type === "transfer" ||
      data?.parsed?.type === "transferChecked"
    );
  }) as ParsedInstruction | undefined;

  const to_address = mintInstruction
    ? mintInstruction.parsed.info.account ||
      mintInstruction.parsed.info.destination
    : null;

  const from_address = mintInstruction
    ? mintInstruction.parsed.info.multisigMintAuthority ||
      mintInstruction.parsed.info.mintAuthority ||
      mintInstruction.parsed.info.source
    : address;
  if (!from_address) console.log({ mintInstruction });
  return { from_address, to_address };
};

export const getTransactionType = (tx: ParsedTransactionWithMeta): string => {
  const instructions = tx.transaction.message
    .instructions as ParsedInstruction[];
  for (const inst of instructions) {
    const data = inst as ParsedInstruction;
    if (data?.parsed?.type) {
      return data.parsed.type;
    }
  }
  return "UNKNOWN";
};
