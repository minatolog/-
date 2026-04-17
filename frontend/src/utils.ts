// 将一个文件转换为 Data URL(把图片转换成 b64 字符串)
export function fileToDataUrl(file: File): Promise<string> {
  const reader = new FileReader();
  const dataUrlPromise: Promise<string> = new Promise((resolve, reject) => {
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image file."));
      }
    }
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}