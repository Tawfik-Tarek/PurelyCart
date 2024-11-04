import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  customerId: text("customerId"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token], //indexing
    }),
  })
);

export const paswwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({
      columns: [vt.id, vt.token], //indexing
    }),
  })
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (vt) => ({
    compositePk: primaryKey({
      columns: [vt.id, vt.token], //indexing
    }),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  created: timestamp("created", { mode: "date" }).defaultNow(),
});

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated", { mode: "date" }).defaultNow(),
  productId: serial("productId").references(() => products.id, {
    onDelete: "cascade",
  }),
});

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("image").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  updated: timestamp("updated", { mode: "date" }).defaultNow(),
  variantId: serial("variantId").references(() => productVariants.id, {
    onDelete: "cascade",
  }),
});

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: serial("variantId").references(() => productVariants.id, {
    onDelete: "cascade",
  }),
});

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    comment: text("comment").notNull(),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    productId: serial("productId").references(() => products.id, {
      onDelete: "cascade",
    }),
    created: timestamp("crated", { mode: "date" }).defaultNow(),
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId),
      userIdx: index("userIdx").on(table.userId),
    };
  }
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentId: text("paymentIntentId"),
});

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantId: serial("productVariantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderId: serial("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: "productVariants",
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }),
    variantTags: many(variantTags, { relationName: "variantTags" }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
    relationName: "variantImages",
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantId],
    references: [productVariants.id],
    relationName: "variantTags",
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "reviews",
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders: many(orders, { relationName: "user_orders" }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
}));

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderId],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productId],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantId],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));
