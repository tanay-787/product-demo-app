import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Product Tours Table
export const tours = pgTable(
  'tours',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(), // Assuming user IDs from Stackframe are strings
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull().default('draft'), // e.g., 'draft', 'published', 'private'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

// Tour Steps Table
export const tourSteps = pgTable(
  'tour_steps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tourId: uuid('tour_id').notNull().references(() => tours.id, { onDelete: 'cascade' }),
    stepOrder: integer('step_order').notNull(),
    imageUrl: text('image_url'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

// Annotations Table
export const annotations = pgTable(
  'annotations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    stepId: uuid('step_id').notNull().references(() => tourSteps.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    x: integer('x').notNull(), // Percentage from left (0-100)
    y: integer('y').notNull(), // Percentage from top (0-100)
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

// Define Drizzle Relations

export const toursRelations = relations(tours, ({ many }) => ({
  tourSteps: many(tourSteps),
}));

export const tourStepsRelations = relations(tourSteps, ({ one, many }) => ({
  tour: one(tours, {
    fields: [tourSteps.tourId],
    references: [tours.id],
  }),
  annotations: many(annotations),
}));

export const annotationsRelations = relations(annotations, ({ one }) => ({
  tourStep: one(tourSteps, {
    fields: [annotations.stepId],
    references: [tourSteps.id],
  }),
}));
