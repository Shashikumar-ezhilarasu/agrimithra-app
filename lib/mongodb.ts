import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout faster to avoid hanging
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Successfully connected to MongoDB Atlas");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        if (err.message.includes("IP that isn't whitelisted")) {
          console.warn("⚠️ Tip: Go to MongoDB Atlas -> Network Access -> Add IP Address to whitelist your current IP.");
        }
        cached.promise = null; // Allow retrying later
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    // If we reach here, the promise was rejected.
    // We return null so the caller can handle the absence of a DB.
    return null;
  }
}

export default connectToDatabase;
