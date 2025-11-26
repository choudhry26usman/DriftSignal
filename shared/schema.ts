import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Review schema for marketplace reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  externalReviewId: text("external_review_id"), // For duplicate detection (e.g., Amazon review ID)
  marketplace: text("marketplace").notNull(), // Amazon, Shopify, Walmart, Website
  productId: text("product_id"), // ASIN, product ID, etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  rating: integer("rating"),
  sentiment: text("sentiment").notNull(), // positive, neutral, negative
  category: text("category").notNull(), // shipping, defect, service, etc.
  severity: text("severity").notNull(), // low, medium, high, critical
  status: text("status").notNull().default("open"), // open, in_progress, resolved
  aiSuggestedReply: text("ai_suggested_reply"),
  aiAnalysisDetails: text("ai_analysis_details"), // JSON string with detailed analysis
  verified: integer("verified").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").notNull(), // Review creation date from marketplace
  importedAt: timestamp("imported_at").defaultNow(), // When we imported it
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  importedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Tracked products schema
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // Amazon, Shopify, Walmart
  productId: text("product_id").notNull(), // ASIN, product ID, etc.
  productName: text("product_name").notNull(),
  lastImported: timestamp("last_imported").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  lastImported: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
