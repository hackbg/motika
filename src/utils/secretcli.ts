import * as child from "child_process";

export function generateMultisigSendTx(
  fromAlias: string,
  to: string,
  amount: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    child.exec(
      `secretcli tx send $(secretcli keys show -a ${fromAlias}) ${to} ${amount}usrct --generate-only`,
      (error, data) => {
        if (error) reject(error);
        resolve(data);
      }
    );
  });
}
