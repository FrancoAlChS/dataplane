import { getCredentials } from "@/modules/database/infrastructure/sa/database.sa";
import { Pool } from "pg";

// Use globalThis to persist the pool and state across hot reloads in development
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
  currentCredentialsJson: string | undefined;
  poolPromise: Promise<Pool> | undefined;
};

async function getPool(): Promise<Pool> {
  const credentials = await getCredentials();
  const credentialsJson = JSON.stringify(credentials);

  // 1. If we already have a healthy pool and credentials haven't changed, return it
  if (
    globalForDb.pool &&
    credentialsJson === globalForDb.currentCredentialsJson
  ) {
    return globalForDb.pool;
  }

  // 2. If a pool is currently being initialized, wait for it
  if (globalForDb.poolPromise) {
    try {
      await globalForDb.poolPromise;
    } catch (e) {
      // If the pending promise failed, we'll try to create a new one below
      console.error("Previous pool initialization failed:", e);
    }

    // After waiting, check again if we now have a valid pool for these credentials
    if (
      globalForDb.pool &&
      credentialsJson === globalForDb.currentCredentialsJson
    ) {
      return globalForDb.pool;
    }
  }

  // 3. Initialize/Recreate the pool
  globalForDb.poolPromise = (async () => {
    try {
      // End existing pool if it exists and credentials changed
      if (globalForDb.pool) {
        const oldPool = globalForDb.pool;
        globalForDb.pool = undefined;
        // Don't await here to avoid blocking new pool creation, 
        // but handle errors to avoid unhandled rejections
        oldPool.end().catch((err) => {
          console.error("Error ending old database pool:", err);
        });
      }

      let newPool: Pool;
      if (credentials) {
        newPool = new Pool({
          host: credentials.host,
          port: credentials.port,
          user: credentials.user,
          password: credentials.password,
          database: credentials.database,
          ssl: credentials.ssl,
          // Add some sensible defaults to prevent resource exhaustion
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });
      } else {
        // Fallback to env vars for development or if not setup yet
        newPool = new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: process.env.DB_SSL === "true",
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });
      }

      // Test the connection before considering it ready
      const client = await newPool.connect();
      client.release();

      globalForDb.pool = newPool;
      globalForDb.currentCredentialsJson = credentialsJson;
      return newPool;
    } finally {
      // Clear the promise once done so subsequent calls can try again if it failed
      globalForDb.poolPromise = undefined;
    }
  })();

  return globalForDb.poolPromise;
}

export const query = async (text: string, params?: unknown[]) => {
  const p = await getPool();
  return p.query(text, params);
};
