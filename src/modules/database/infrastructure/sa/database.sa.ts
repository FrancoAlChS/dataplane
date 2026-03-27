"use server";

import { cookies } from "next/headers";
import { Pool } from "pg";
import { Database } from "../../domain/database";

const COOKIE_NAME = "db_credentials";

export async function testConnection(credentials: Database) {
  const pool = new Pool({
    host: credentials.host,
    port: credentials.port,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: credentials.ssl,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await pool.end();
    return { success: true };
  } catch (error) {
    console.error("Connection test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export async function saveCredentials(credentials: Database) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, JSON.stringify(credentials), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true };
}

export async function getCredentials(): Promise<Database | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value) as Database;
  } catch {
    return null;
  }
}

export async function clearCredentials() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
