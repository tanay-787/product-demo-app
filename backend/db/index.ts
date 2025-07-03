import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { tours, tourSteps, annotations } from './schema/product-tours';
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_OWNER_URL) {
    throw new Error("DATABASE_OWNER_URL environment variable is required")
}

const combinedSchema = { tours, tourSteps, annotations };

const sql = neon(process.env.DATABASE_OWNER_URL!);

export const db = drizzle(sql, { schema: combinedSchema });
