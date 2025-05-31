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

// 🔷 ENUM: Define userType enum
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
export const author = pgTable("author", {
  authorId: serial("author_id").primaryKey(),
  authorName: text("author_name"),
  genreId: integer("genre_id").references(() => genreTable.genreId), // ✅ One-to-one FK
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// 🔹 Junction Table: Author-Genre Many-to-Many
export const authorGenreTable = pgTable('authorGenreTable', {
  authorGenreId: serial('authorGenreId').primaryKey(),
  authorId: integer('authorId').notNull().references(() => author.authorId, { onDelete: 'cascade' }),
  genreId: integer('genreId').notNull().references(() => genreTable.genreId, { onDelete: 'cascade' }),
});

// 🔹 Book Table 
export const bookTable = pgTable('bookTable', {
  bookId: serial('bookId').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  isbn: text('isbn'),
  publicationYear: integer('publicationYear'),
  authorId: integer('authorId').notNull().references(() => author.authorId, { onDelete: 'cascade' }),
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

export type TAuthorInsert = typeof author.$inferInsert;
export type TAuthorSelect = typeof author.$inferSelect;

export type TAuthorGenreInsert = typeof authorGenreTable.$inferInsert;
export type TAuthorGenreSelect = typeof authorGenreTable.$inferSelect;

export type TBookInsert = typeof bookTable.$inferInsert;
export type TBookSelect = typeof bookTable.$inferSelect;

export type TBookOwnerInsert = typeof bookOwnerTable.$inferInsert;
export type TBookOwnerSelect = typeof bookOwnerTable.$inferSelect;

// 🔹 Relations

// genre → authors (many-to-many through authorGenreTable)
export const genreAuthorsRelation = relations(genreTable, ({ many }) => ({
  authorGenres: many(authorGenreTable),
}));

// author → genres (many-to-many through authorGenreTable)
export const authorGenresRelation = relations(author, ({ many }) => ({
  authorGenres: many(authorGenreTable),
}));

// ✅ genre → author (one-to-many via author.genreId)
export const genreAuthorRelation = relations(genreTable, ({ many }) => ({
  authors: many(author),
}));

// ✅ author → genre (one-to-one via genreId)
export const authorGenreRelation = relations(author, ({ one }) => ({
  genre: one(genreTable, {
    fields: [author.genreId],
    references: [genreTable.genreId],
  }),
}));

// authorGenre → author (many-to-one)
export const authorGenreAuthorRelation = relations(authorGenreTable, ({ one }) => ({
  author: one(author, {
    fields: [authorGenreTable.authorId],
    references: [author.authorId]
  }),
}));

// authorGenre → genre (many-to-one)
export const authorGenreGenreRelation = relations(authorGenreTable, ({ one }) => ({
  genre: one(genreTable, {
    fields: [authorGenreTable.genreId],
    references: [genreTable.genreId]
  }),
}));

// book → author (one to one)
export const bookAuthorRelation = relations(bookTable, ({ one }) => ({
  author: one(author, {
    fields: [bookTable.authorId],
    references: [author.authorId]
  }),
}));

// author → books (one to many)
export const authorBookRelation = relations(author, ({ many }) => ({
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
