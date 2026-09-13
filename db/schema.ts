import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  json,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// products
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),

    // core product info
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    tagline: varchar("tagline", { length: 200 }),
    description: text("description"),

    // links & media
    websiteUrl: text("website_url"),
    logoUrl: text("logo_url"),
    tags: json("tags").$type<string[]>(), // e.g. ["AI", "Productivity"]

    // voting
    voteCount: integer("vote_count").notNull().default(0),

    // metadata
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    status: varchar("status", { length: 20 }).default("pending"), // pending | approved | rejected
    submittedBy: varchar("submitted_by", { length: 120 }).default("anonymous"),
    userId: varchar("user_id", { length: 255 }), // Clerk user ID

    // organization reference (for backend queries only)
    organizationId: varchar("organization_id", { length: 255 }), // Clerk org ID
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    statusIdx: index("products_status_idx").on(table.status),
    organizationIdx: index("products_organization_idx").on(
      table.organizationId
    ),
  })
);

// votes
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProductIdx: uniqueIndex("votes_user_product_idx").on(
      table.userId,
      table.productId
    ),
    productIdx: index("votes_product_idx").on(table.productId),
    userIdx: index("votes_user_idx").on(table.userId),
  })
);
