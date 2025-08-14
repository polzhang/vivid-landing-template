// lib/mongodb.ts
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// Ensure the MongoDB URI is set as a Vercel environment variable
const uri = process.env.MONGODB_URL;
console.log('MongoDB URI:', uri); // Debugging line to check if the URI is loaded

if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local or Vercel Environment Variables');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Extend the global object type to include custom properties
declare global {
    // eslint-disable-next-line no-var
    var _mongoClient: MongoClient | undefined;
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Create a single, cached MongoClient instance
if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to preserve the client across HMR
    // to prevent multiple connections
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        global._mongoClientPromise = global._mongoClient.connect();
    }
    client = global._mongoClient;
    clientPromise = global._mongoClientPromise ?? null;
} else {
    // In production, instantiate a new client
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    if (!clientPromise) {
        throw new Error('MongoDB client is not initialized.');
    }
    const mongoClient = await clientPromise;
    return mongoClient.db();
}
