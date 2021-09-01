export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString();
      if (text) resolve(text);
      else reject();
    };
    reader.readAsText(file);
  });
}
