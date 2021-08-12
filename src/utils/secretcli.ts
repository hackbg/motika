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
