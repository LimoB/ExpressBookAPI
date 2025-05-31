import "dotenv/config";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Initialize Postgres client
export const client = new Client({
  connectionString: process.env.DATABASE_URL as string,
});

const main = async () => {
  try {
    await client.connect(); // Connect to the database
    console.log("Database connected successfully 🚀");
  } catch (error) {
    console.error("Database connection failed ❌", error);
  }
};

main();

// Initialize Drizzle with schema and logging
const db = drizzle(client, { schema, logger: true });
export default db;
