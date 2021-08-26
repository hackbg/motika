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
