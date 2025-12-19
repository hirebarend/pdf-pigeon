import * as admin from 'firebase-admin';
import axios from 'axios';

let firebaseApp: admin.app.App | null = null;

function initializeFirebaseApp(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? admin.credential.cert(
        JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString(
            'ascii',
          ),
        ),
      )
    : admin.credential.applicationDefault();

  firebaseApp = admin.initializeApp({
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return firebaseApp;
}

export async function uploadBufferToFirebaseStorage(
  buffer: Buffer,
  name: string | undefined = undefined,
  mimeType: string = 'application/octet-stream',
): Promise<string> {
  initializeFirebaseApp();

  if (!name) {
    name = crypto.randomUUID();
  }

  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error('FIREBASE_STORAGE_BUCKET environment variable is not set.');
  }

  const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

  const file = bucket.file(name);

  await file.save(buffer, {
    metadata: {
      contentType: mimeType,
    },
    public: true,
  });

  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${name}`;
}
