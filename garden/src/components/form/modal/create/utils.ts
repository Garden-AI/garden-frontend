export const fileToString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file: result is null"));
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(new Error(`Failed to read: ${error.target?.error?.message}`));
    };

    return reader.readAsText(file);
  });
};
