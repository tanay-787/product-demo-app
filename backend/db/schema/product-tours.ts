import { pgTable, uuid, text, timestamp, integer, boolean, varchar, real } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Product Tours Table
export const tours = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Assuming user IDs from Stackframe are strings
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // e.g., 'draft', 'published', 'private'
  sharingStatus: varchar("sharing_status", { length: 20 }).default("private"), // 'private', 'public', 'password_protected'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Tour Steps Table
export const tourSteps = pgTable("tour_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  tourId: uuid("tour_id")
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"), // New column for video URL
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Annotations Table
export const annotations = pgTable("annotations", {
  id: uuid("id").primaryKey().defaultRandom(),
  stepId: uuid("step_id")
    .notNull()
    .references(() => tourSteps.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  x: real("x").notNull(), // Percentage from left (0-100)
  y: real("y").notNull(), // Percentage from top (0-100)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Tour Shares Table
export const tourShares = pgTable("tour_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  tourId: uuid("tour_id")
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),
  shareId: varchar("share_id", { length: 255 }).notNull().unique(),
  isPublic: boolean("is_public").default(false),
  passwordHash: varchar("password_hash", { length: 255 }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Cloudinary Files Table
export const cloudinaryFiles = pgTable("cloudinary_files", {
  id: uuid("id").primaryKey().defaultRandom(), // Changed to uuid for consistency and better distribution
  publicId: text("public_id").notNull().unique(), // Cloudinary's unique identifier for the asset
  mediaUrl: text("media_url").notNull(),         // Media URL for the asset on Cloudinary's CDN
  resourceType: text("resource_type").notNull(),     // Type of asset (e.g., 'image', 'video', 'raw')
  userId: text("user_id").notNull(),           // User associated with the file
  uploadTimestamp: timestamp("upload_timestamp").defaultNow(),
});

// Define Drizzle Relations
export const toursRelations = relations(tours, ({ many }) => ({
  tourSteps: many(tourSteps),
  tourShares: many(tourShares),
}))

export const tourStepsRelations = relations(tourSteps, ({ one, many }) => ({
  tour: one(tours, {
    fields: [tourSteps.tourId],
    references: [tours.id],
  }),
  annotations: many(annotations),
}))

export const annotationsRelations = relations(annotations, ({ one }) => ({
  tourStep: one(tourSteps, {
    fields: [annotations.stepId],
    references: [tourSteps.id],
  }),
}))

export const tourSharesRelations = relations(tourShares, ({ one }) => ({
  tour: one(tours, {
    fields: [tourShares.tourId],
    references: [tours.id],
  }),
}))

// Adding relation for cloudinaryFiles if needed, e.g., to link to users table
// For now, no direct relation defined, user_id acts as a foreign key conceptually
