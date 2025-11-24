import { 
  type User, 
  type InsertUser,
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

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Review methods
  getReviews(): Promise<Review[]>;
  getReviewById(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewStatus(id: string, status: string): Promise<void>;
  checkReviewExists(externalReviewId: string, marketplace: string): Promise<boolean>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductByIdentifier(platform: string, productId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductLastImported(id: string): Promise<void>;
  getReviewCountForProduct(platform: string, productId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Review methods (not implemented for MemStorage)
  async getReviews(): Promise<Review[]> {
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

  async checkReviewExists(externalReviewId: string, marketplace: string): Promise<boolean> {
    return false;
  }

  // Product methods (not implemented for MemStorage)
  async getProducts(): Promise<Product[]> {
    return [];
  }

  async getProductByIdentifier(platform: string, productId: string): Promise<Product | undefined> {
    return undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    throw new Error("Not implemented");
  }

  async updateProductLastImported(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async getReviewCountForProduct(platform: string, productId: string): Promise<number> {
    return 0;
  }
}

export class DBStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.importedAt));
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    const result = await db.query.reviews.findFirst({
      where: (reviews, { eq }) => eq(reviews.id, id),
    });
    return result;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async updateReviewStatus(id: string, status: string): Promise<void> {
    await db.update(reviews).set({ status }).where(eq(reviews.id, id));
  }

  async checkReviewExists(externalReviewId: string, marketplace: string): Promise<boolean> {
    if (!externalReviewId) return false;
    
    const result = await db.select({ id: reviews.id })
      .from(reviews)
      .where(
        and(
          eq(reviews.externalReviewId, externalReviewId),
          eq(reviews.marketplace, marketplace)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.lastImported));
  }

  async getProductByIdentifier(platform: string, productId: string): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: (products, { eq, and }) => and(
        eq(products.platform, platform),
        eq(products.productId, productId)
      ),
    });
    return result;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProductLastImported(id: string): Promise<void> {
    await db.update(products).set({ lastImported: new Date() }).where(eq(products.id, id));
  }

  async getReviewCountForProduct(platform: string, productId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        and(
          eq(reviews.marketplace, platform),
          eq(reviews.productId, productId)
        )
      );
    
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DBStorage();
