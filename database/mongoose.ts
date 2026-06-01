import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI)  throw new Error("Please define the MONGODB_URI environment variable");


declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top   
    var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

/**
 * Establishes and returns a cached Mongoose connection to the configured MongoDB URI.
 *
 * Subsequent calls return the existing cached connection. If a connection attempt fails,
 * the function clears the in-progress cache and rethrows the original error.
 *
 * @returns The active Mongoose connection object
 * @throws The underlying error thrown while attempting to connect to MongoDB
 */
export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
    })
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }


  console.info("Successfully connected to MongoDB");
  return cached.conn;
}