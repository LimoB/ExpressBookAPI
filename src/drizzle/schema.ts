import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  pgEnum
} from "drizzle-orm/pg-core";

// 🔷 ENUM: Define userType enum (same as before)
export const roleEnum = pgEnum("userType", ['member', 'admin']);

// 🔹 Genre Table 
export const genreTable = pgTable('genreTable', {
  genreId: serial('genreId').primaryKey(),
  genreName: text('genreName'),
  genreCode: text('genreCode'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// 🔹 Author Table 
export const authorTable = pgTable('authorTable', {
  authorId: serial('authorId').primaryKey(),
  authorName: text('authorName'),
  genreId: integer('genreId').notNull().references(() => genreTable.genreId, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// 🔹 Book Table 
export const bookTable = pgTable('bookTable', {
  bookId: serial('bookId').primaryKey(),
  title: text('title').notNull(),                // ✅ Renamed from bookTitle
  description: text('description'),              // ✅ Added description
  isbn: text('isbn'),
  publicationYear: integer('publicationYear'),
  authorId: integer('authorId').notNull().references(() => authorTable.authorId, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// 🔹 User Table 
export const userTable = pgTable("userTable", {
  userId: serial("userId").primaryKey(),
  fullName: varchar("fullName"),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  userType: roleEnum("userType").default("member").notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// 🔹 Book Owner Table 
export const bookOwnerTable = pgTable('bookOwnerTable', {
  bookOwnerId: serial('bookOwnerId').primaryKey(),
  bookId: integer("bookId").notNull().references(() => bookTable.bookId, { onDelete: 'cascade' }),
  ownerId: integer('ownerId').notNull().references(() => userTable.userId, { onDelete: 'cascade' }),
});

// 🔹 Infer Types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TGenreInsert = typeof genreTable.$inferInsert;
export type TGenreSelect = typeof genreTable.$inferSelect;

export type TAuthorInsert = typeof authorTable.$inferInsert;
export type TAuthorSelect = typeof authorTable.$inferSelect;

export type TBookInsert = typeof bookTable.$inferInsert;
export type TBookSelect = typeof bookTable.$inferSelect;

export type TBookOwnerInsert = typeof bookOwnerTable.$inferInsert;
export type TBookOwnerSelect = typeof bookOwnerTable.$inferSelect;

// 🔹 Relations

// author → genre (one to one)
export const authorGenreRelation = relations(authorTable, ({ one }) => ({
  genre: one(genreTable, {
    fields: [authorTable.genreId],
    references: [genreTable.genreId]
  })
}));

// genre → authors (one to many)
export const genreAuthorRelation = relations(genreTable, ({ many }) => ({
  authors: many(authorTable)
}));

// book → author (one to one)
export const bookAuthorRelation = relations(bookTable, ({ one }) => ({
  author: one(authorTable, {
    fields: [bookTable.authorId],
    references: [authorTable.authorId]
  })
}));

// author → books (one to many)
export const authorBookRelation = relations(authorTable, ({ many }) => ({
  books: many(bookTable)
}));

// bookOwner → user (many to one)
export const bookOwnerUserRelation = relations(bookOwnerTable, ({ one }) => ({
  user: one(userTable, {
    fields: [bookOwnerTable.ownerId],
    references: [userTable.userId]
  })
}));

// user → ownedBooks (one to many)
export const userOwnedBooksRelation = relations(userTable, ({ many }) => ({
  ownedBooks: many(bookOwnerTable)
}));

// bookOwner → book (many to one)
export const bookOwnerBookRelation = relations(bookOwnerTable, ({ one }) => ({
  book: one(bookTable, {
    fields: [bookOwnerTable.bookId],
    references: [bookTable.bookId]
  })
}));

// book → owners (one to many)
export const bookOwnersRelation = relations(bookTable, ({ many }) => ({
  owners: many(bookOwnerTable)
}));
