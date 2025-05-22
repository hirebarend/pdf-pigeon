import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { Collection, Db, MongoClient } from 'mongodb';

export async function Logger(
  connectionString: string,
  dbName: string,
  collectionName: string,
) {
  const mongoClient = await MongoClient.connect(connectionString);

  const db: Db = mongoClient.db(dbName);

  const collection: Collection = db.collection(collectionName);

  return (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    try {
      // Exclude all OPTIONS HTTP method requests
      if (request.method === 'OPTIONS') {
        done();

        return;
      }

      // Exclude specific routes
      if (['/api/v1/health', '/api/v1/ping'].includes(request.url)) {
        done();

        return;
      }

      const payload = {
        body: request.body instanceof Buffer ? null : request.body,
        headers: request.headers,
        id: request.id,
        method: request.method,
        params: request.params,
        path: request.routeOptions.url,
        statusCode: reply.statusCode,
        query: Object.keys(request.query as any).reduce(
          (dict: { [key: string]: string }, key: string) => {
            dict[key] = (request.query as any)[key];

            return dict;
          },
          {},
        ),
        timestamp: new Date().toISOString(),
        timestampUnix: Math.floor(new Date().getTime() / 100),
        url: request.url,
      };

      collection
        .insertOne(payload)
        .then(() => done())
        .catch(() => done());
    } catch {
      done();
    }
  };
}
