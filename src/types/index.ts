export enum TxType {
  Spend = "spend",
  ContractCall = "contractCall",
}

export interface IKey {
  name: string;
  type: "local" | "multi";
  address: string;
  pubkey: string;
}

export interface IAccountQueryResult {
  accountNumber: number;
  sequence: number;
}

export interface Config {
  chainId?: string;
  indent?: boolean;
  keyringBackend?: string;
  node?: string;
  output?: string;
  trustNode?: boolean;
}
