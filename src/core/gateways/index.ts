import axios from 'axios';

export * from './aws-s3.gateway';
export * from './firebase-storage.gateway';

export async function uploadFromUrl(
  url: string,
  name: string | undefined = undefined,
  uploadBuffer: (
    buffer: Buffer,
    name: string | undefined,
    mimeType: string,
  ) => Promise<string>,
): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  return await uploadBuffer(
    Buffer.from(response.data),
    name,
    response.headers['Content-Type'] as string,
  );
}
