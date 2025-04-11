export async function extractTextFromBuffer(buffer, mimeType) {
  let worker;
  try {
    if (mimeType === 'application/pdf') {
      return (await pdf(buffer)).text;
    } else if (mimeType.startsWith('image/')) {
      worker = await createWorker(); // Explicit worker declaration
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(buffer);
      return data.text;
    }
    return '';
  } finally {
    worker?.terminate(); // Guaranteed cleanup
  }
}