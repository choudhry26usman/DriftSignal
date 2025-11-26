import { 
  type User, 
  type UpsertUser,
  type Review,
  type InsertReview,
  type Product,
  type InsertProduct,
  users,
  reviews,
  products,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Review methods (user-scoped)
  getReviews(userId?: string): Promise<Review[]>;
  getReviewById(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewStatus(id: string, status: string): Promise<void>;
  checkReviewExists(externalReviewId: string, marketplace: string, userId?: string): Promise<boolean>;
  
  // Product methods (user-scoped)
  getProducts(userId?: string): Promise<Product[]>;
  getProductByIdentifier(platform: string, productId: string, userId?: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductLastImported(id: string): Promise<void>;
  getReviewCountForProduct(platform: string, productId: string, userId?: string): Promise<number>;
  deleteProduct(productId: string, userId?: string): Promise<boolean>;
  deleteReviewsForProduct(platform: string, productId: string, userId?: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = userData.id ? this.users.get(userData.id) : undefined;
    const user: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Review methods (not implemented for MemStorage)
  async getReviews(userId?: string): Promise<Review[]> {
    return [];
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    return undefined;
  }

  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("Not implemented");
  }

  async updateReviewStatus(id: string, status: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async checkReviewExists(externalReviewId: string, marketplace: string, userId?: string): Promise<boolean> {
    return false;
  }

  // Product methods (not implemented for MemStorage)
  async getProducts(userId?: string): Promise<Product[]> {
    return [];
  }

  async getProductByIdentifier(platform: string, productId: string, userId?: string): Promise<Product | undefined> {
    return undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    throw new Error("Not implemented");
  }

  async updateProductLastImported(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async getReviewCountForProduct(platform: string, productId: string, userId?: string): Promise<number> {
    return 0;
  }

  async deleteProduct(productId: string, userId?: string): Promise<boolean> {
    return false;
  }

  async deleteReviewsForProduct(platform: string, productId: string, userId?: string): Promise<number> {
    return 0;
  }
}

export class DBStorage implements IStorage {
  // User methods (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Review methods (user-scoped)
  async getReviews(userId?: string): Promise<Review[]> {
    if (userId) {
      return db.select().from(reviews)
        .where(eq(reviews.userId, userId))
        .orderBy(desc(reviews.importedAt));
    }
    return db.select().from(reviews).orderBy(desc(reviews.importedAt));
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    const result = await db.select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async updateReviewStatus(id: string, status: string): Promise<void> {
    await db.update(reviews).set({ status }).where(eq(reviews.id, id));
  }

  async checkReviewExists(externalReviewId: string, marketplace: string, userId?: string): Promise<boolean> {
    if (!externalReviewId) return false;
    
    const conditions = [
      eq(reviews.externalReviewId, externalReviewId),
      eq(reviews.marketplace, marketplace)
    ];
    
    if (userId) {
      conditions.push(eq(reviews.userId, userId));
    }
    
    const result = await db.select({ id: reviews.id })
      .from(reviews)
      .where(and(...conditions))
      .limit(1);
    
    return result.length > 0;
  }

  // Product methods (user-scoped)
  async getProducts(userId?: string): Promise<Product[]> {
    if (userId) {
      return db.select().from(products)
        .where(eq(products.userId, userId))
        .orderBy(desc(products.lastImported));
    }
    return db.select().from(products).orderBy(desc(products.lastImported));
  }

  async getProductByIdentifier(platform: string, productId: string, userId?: string): Promise<Product | undefined> {
    const conditions = [
      eq(products.platform, platform),
      eq(products.productId, productId)
    ];
    
    if (userId) {
      conditions.push(eq(products.userId, userId));
    }
    
    const result = await db.select()
      .from(products)
      .where(and(...conditions))
      .limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProductLastImported(id: string): Promise<void> {
    await db.update(products).set({ lastImported: new Date() }).where(eq(products.id, id));
  }

  async getReviewCountForProduct(platform: string, productId: string, userId?: string): Promise<number> {
    const conditions = [
      eq(reviews.marketplace, platform),
      eq(reviews.productId, productId)
    ];
    
    if (userId) {
      conditions.push(eq(reviews.userId, userId));
    }
    
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(and(...conditions));
    
    return Number(result[0]?.count || 0);
  }

  async deleteProduct(productId: string, userId?: string): Promise<boolean> {
    const conditions = [eq(products.id, productId)];
    if (userId) {
      conditions.push(eq(products.userId, userId));
    }
    
    const result = await db.delete(products)
      .where(and(...conditions))
      .returning();
    
    return result.length > 0;
  }

  async deleteReviewsForProduct(platform: string, productId: string, userId?: string): Promise<number> {
    const conditions = [
      eq(reviews.marketplace, platform),
      eq(reviews.productId, productId)
    ];
    
    if (userId) {
      conditions.push(eq(reviews.userId, userId));
    }
    
    const result = await db.delete(reviews)
      .where(and(...conditions))
      .returning();
    
    return result.length;
  }
}

export const storage = new DBStorage();
