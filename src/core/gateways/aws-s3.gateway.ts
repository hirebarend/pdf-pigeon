import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


export async function uploadBufferToAwsS3(
  buffer: Buffer,
  name: string | undefined = undefined,
  mimeType: string = 'application/octet-stream',
): Promise<string> {
  if (!name) {
    name = crypto.randomUUID();
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

