import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import { faker } from '@faker-js/faker';

export async function uploadBuffer(
  buffer: Buffer,
  name: string | undefined = undefined,
  mimeType: string = 'application/octet-stream',
): Promise<string> {
  if (!name) {
    name = faker.string.uuid();
  }

  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  const command = new PutObjectCommand({
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.AWS_S3_BUCKET,
    ContentType: mimeType,
    Key: name,
  });

  await s3Client.send(command);

  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${name}`;
}

export async function uploadFromUrl(
  url: string,
  name: string | undefined = undefined,
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
