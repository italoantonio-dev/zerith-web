import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
  index,
  uniqueIndex,
  customType,
} from "drizzle-orm/pg-core";
const date = (name: string) => timestamp(name, { withTimezone: true });
const bytes = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
  isAdmin: boolean("is_admin").notNull().default(false),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
});
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: date("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);
export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: date("access_token_expires_at"),
    refreshTokenExpiresAt: date("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("account_user_idx").on(t.userId),
    uniqueIndex("account_provider_identity").on(t.providerId, t.accountId),
  ],
);
export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: date("expires_at").notNull(),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
export const twoFactor = pgTable(
  "two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(false),
    failedVerificationCount: integer("failed_verification_count").default(0),
    lockedUntil: date("locked_until"),
  },
  (t) => [index("two_factor_user_idx").on(t.userId)],
);
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
export const mfaProof = pgTable("admin_mfa_proof", {
  sessionId: text("session_id")
    .primaryKey()
    .references(() => session.id, { onDelete: "cascade" }),
  verifiedAt: date("verified_at").notNull().defaultNow(),
});
export const setupToken = pgTable("setup_token", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  email: text("email").notNull(),
  expiresAt: date("expires_at").notNull(),
  consumedAt: date("consumed_at"),
});
export const assets = pgTable("media_asset", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  alt: text("alt").notNull(),
  mime: text("mime").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  size: integer("size").notNull(),
  data: bytes("data").notNull(),
  createdBy: text("created_by").references(() => user.id),
  createdAt: date("created_at").notNull().defaultNow(),
});
export const posts = pgTable(
  "post",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    category: text("category").notNull().default("Tecnologia"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    status: text("status", { enum: ["draft", "published", "archived"] })
      .notNull()
      .default("draft"),
    coverAssetId: text("cover_asset_id").references(() => assets.id),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    publishedAt: date("published_at"),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (t) => [index("post_publication_idx").on(t.status, t.publishedAt)],
);
export const products = pgTable("product", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  href: text("href").notNull().default("/contato"),
  imageAssetId: text("image_asset_id").references(() => assets.id),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});
export const audit = pgTable(
  "audit_event",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityId: text("entity_id"),
    detail: text("detail").notNull().default(""),
    createdAt: date("created_at").notNull().defaultNow(),
  },
  (t) => [index("audit_date_idx").on(t.createdAt)],
);
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
