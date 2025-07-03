import { NeonDbError } from '@neondatabase/serverless';

/**
 * Wraps a database operation to provide more granular error handling for Neon-specific issues.
 * @param operation The async function containing the database logic.
 * @returns The result of the operation.
 * @throws An error that includes more context if it's a recognized Neon error.
 */
export async function safeNeonOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Check for known Neon error patterns or types
    if (error instanceof NeonDbError) {
      console.error("Neon Database Error:", error.message);
      // You can add more specific handling based on error.code or error.detail if available
      throw new Error(`Database error: ${error.message}`);
    } else if (error.message?.includes('connection pool timeout')) {
      console.error('Neon connection pool timeout detected.', error);
      throw new Error('Database temporarily unavailable. Please try again later.');
    } else if (error.message?.includes('SSL connection') || error.message?.includes('Network error')) {
      console.error('Neon network/SSL error detected.', error);
      throw new Error('Could not connect to the database. Please check your network.');
    }
    // Re-throw for general application error handling
    throw error;
  }
}
