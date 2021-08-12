import * as child from "child_process";

export function exportPrivateKey(
  keyAlias: string,
  password: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cli = child.spawn("secretcli", ["keys", "export", keyAlias]);
    cli.stdin.setDefaultEncoding("utf-8");
    cli.stdin.write(`${password}\n`);
    cli.stdin.write(`${password}\n`);
    cli.stdin.end();
    cli.stderr.on("data", (data) => {
      const result = String.fromCharCode(...data);
      if (result.startsWith("ERROR")) reject();
      resolve(result);
    });
  });
}

// export function importPrivateKey(
//   keyAlias: string,
//   privateKey: string
// ): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     child.exec(
//       `secretcli keys import ${keyAlias} <(printf '${privateKey}')`,
//       (error, data, getter) => {
//         console.log(error, data, getter);
//       }
//     );
//   });
// }
