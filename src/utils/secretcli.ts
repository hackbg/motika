import * as child from "child_process";

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
  return promisifyExec(
    `secretcli tx compute execute ${contract} '${message}' ` +
      "--generate-only " +
      `--from $(secretcli keys show -a ${fromAlias}) ` +
      `--code-hash ${contractHash} ` +
      "--enclave-key io-master-cert.der"
  );
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
