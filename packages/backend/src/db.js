import { env } from "node:process";
import PG, { QueryResultRow } from "pg"; // A CJS-only package, no named export

const pool = new PG.Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
});

export async function query(
  text,
  param
) {
  return pool.query<R>(text, param);
}

export async function transaction(op) {
  const client = await pool.connect();
  await client.query("BEGIN;");
  try {
    await op(client);
  } finally {
    await client.query("COMMIT;");
  }
}

