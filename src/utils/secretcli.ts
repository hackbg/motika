import { IKey, IAccountQueryResult, Config } from "@/types";

export function generateSendTx(
  sender: string,
  recipient: string,
  amount: number
): Promise<string> {
  return promisifyExec(
    `secretcli tx send ${sender} ${recipient} ${amount}usrct --generate-only`
  );
}

export async function generateContractCallTx(
  sender: string,
  contract: string,
  contractHash: string,
  sequence: number,
  accountNumber: number,
  message: string
): Promise<string> {
  await getCertificates();
  return promisifyExec(
    `secretcli tx compute execute ${contract} '${message}' ` +
      "--generate-only " +
      `--from ${sender} ` +
      `--code-hash ${contractHash} ` +
      "--enclave-key io-master-cert.der " +
      `--sequence ${sequence} ` +
      `--account-number ${accountNumber}`
  );
}

export async function signMultisigTx(
  sender: string,
  signerAlias: string,
  sequence: number,
  accountNumber: number,
  unsignedTxPath: string
): Promise<string> {
  return promisifyExec(
    `secretcli tx sign ${unsignedTxPath} ` +
      `--multisig=${sender} ` +
      "--offline " +
      `--account-number=${accountNumber} ` +
      `--sequence=${sequence} ` +
      `--from=${signerAlias}`
  );
}

export async function getKeys(): Promise<IKey[]> {
  const result = await promisifyExec("secretcli keys list");
  return JSON.parse(result);
}

export async function getKey(alias: string): Promise<IKey> {
  const result = await promisifyExec(`secretcli keys show ${alias}`);
  return JSON.parse(result);
}

export async function queryAccount(
  account: string
): Promise<IAccountQueryResult> {
  const result = await promisifyExec(`secretcli q account ${account}`);
  const data = JSON.parse(result);
  return {
    accountNumber: data.value.account_number,
    sequence: data.value.sequence,
  };
}

export async function getContractHash(contract: string): Promise<string> {
  const result = await promisifyExec(
    `secretcli q compute contract-hash ${contract}`
  );
  return result.slice(2); // remove 0x
}

function getCertificates(): Promise<string> {
  return promisifyExec("secretcli query register secret-network-params");
}

export async function getConfig(
  keys: string[] = [
    "chain-id",
    "indent",
    "keyring-backend",
    "node",
    "output",
    "trust-node",
  ]
): Promise<Config> {
  const result = await Promise.all(
    keys.map(async (key) => {
      const value = await promisifyExec(`secretcli config ${key} --get`);
      return value.replace(/\n/, "");
    })
  );
  return {
    chainId: result[0],
    indent: result[1] ? result[1] === "true" : undefined,
    keyringBackend: result[2],
    node: result[3],
    output: result[4],
    trustNode: result[5] ? result[5] === "true" : undefined,
  };
}

function promisifyExec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    window.childProcess.exec(command, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
}
