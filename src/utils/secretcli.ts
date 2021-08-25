import * as child from "child_process";
import { IKey, IAccountQueryResult } from "@/types";

export function generateSendTx(
  fromAlias: string,
  to: string,
  amount: number
): Promise<string> {
  return promisifyExec(
    `secretcli tx send $(secretcli keys show -a ${fromAlias}) ` +
      `${to} ${amount}usrct --generate-only`
  );
}

export async function generateContractCallTx(
  fromAlias: string,
  contract: string,
  message: string
): Promise<string> {
  await getCertificates();
  const contractHash = await getContractHash(contract);
  const { address } = await getKey(fromAlias);
  const { accountNumber, sequence } = await queryAccount(address);
  return promisifyExec(
    `secretcli tx compute execute ${contract} '${message}' ` +
      "--generate-only " +
      `--from ${address} ` +
      `--code-hash ${contractHash} ` +
      "--enclave-key io-master-cert.der " +
      `--sequence ${sequence} ` +
      `--account-number ${accountNumber}`
  );
}

export async function getKeyAliases(): Promise<string[]> {
  const result = await promisifyExec("secretcli keys list");
  const keyList = result ? JSON.parse(result) : [];
  return keyList.map((k: IKey) => k.name);
}

async function getKey(alias: string): Promise<IKey> {
  const result = await promisifyExec(`secretcli keys show ${alias}`);
  return JSON.parse(result);
}

async function queryAccount(account: string): Promise<IAccountQueryResult> {
  const result = await promisifyExec(`secretcli q account ${account}`);
  const data = JSON.parse(result);
  return {
    accountNumber: data.value.account_number,
    sequence: data.value.sequence,
  };
}

async function getContractHash(contract: string) {
  const result = await promisifyExec(
    `secretcli q compute contract-hash ${contract}`
  );
  return result.slice(2); // remove 0x
}

function getCertificates(): Promise<string> {
  return promisifyExec("secretcli query register secret-network-params");
}

function promisifyExec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    child.exec(command, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
}
