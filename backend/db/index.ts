import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { tours, tourSteps, tourShares, annotations, tourStepsRelations, toursRelations, annotationsRelations, tourSharesRelations } from './schema/product-tours';
import dotenv from "dotenv"
import ws from "ws"

dotenv.config()

if (!process.env.DATABASE_OWNER_URL) {
    throw new Error("DATABASE_OWNER_URL environment variable is required")
}

neonConfig.webSocketConstructor = ws;

const combinedSchema = { tours, tourSteps, tourShares, annotations, toursRelations, tourStepsRelations, tourSharesRelations, annotationsRelations };

const pool = new Pool({ connectionString: process.env.DATABASE_OWNER_URL! });

export const db = drizzle(pool, { schema: combinedSchema });
