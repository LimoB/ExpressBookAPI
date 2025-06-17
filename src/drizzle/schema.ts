import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  integer,
  serial
} from "drizzle-orm/pg-core";

// 🔷 ENUM: Roles from JWT
export const roleEnum = pgEnum("user_type", ["admin", "member", "author"]);

// 🔹 User Table (Updated for JWT)
export const userTable = pgTable("user", {
  userId: text("user_id").primaryKey(), // Matches JWT `userId` (string UUID preferred)
  fullName: varchar("full_name"),
  email: varchar("email").notNull().unique(), // JWT email
  password: varchar("password").notNull(),
  userType: roleEnum("user_type").default("member").notNull(), // JWT role
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 🆕 Other Tables (unchanged from earlier, with FK to new `user.userId`)
export const genreTable = pgTable("genre", {
  genreId: serial("genre_id").primaryKey(),
  genreName: text("genre_name"),
  genreCode: text("genre_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const authorTable = pgTable("author", {
  authorId: serial("author_id").primaryKey(),
  authorName: text("author_name"),
  genreId: integer("genre_id").references(() => genreTable.genreId),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const authorGenreTable = pgTable("author_genre", {
  authorGenreId: serial("author_genre_id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => authorTable.authorId, { onDelete: "cascade" }),
  genreId: integer("genre_id").notNull().references(() => genreTable.genreId, { onDelete: "cascade" })
});

export const bookTable = pgTable("book", {
  bookId: serial("book_id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isbn: text("isbn"),
  publicationYear: integer("publication_year"),
  authorId: integer("author_id").notNull().references(() => authorTable.authorId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const bookOwnerTable = pgTable("book_owner", {
  bookOwnerId: serial("book_owner_id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => bookTable.bookId, { onDelete: "cascade" }),
  ownerId: text("owner_id").notNull().references(() => userTable.userId, { onDelete: "cascade" }) // updated FK
});

// 🔹 Inferred Types (unchanged except for userId type)
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TGenreInsert = typeof genreTable.$inferInsert;
export type TGenreSelect = typeof genreTable.$inferSelect;

export type TAuthorInsert = typeof authorTable.$inferInsert;
export type TAuthorSelect = typeof authorTable.$inferSelect;

export type TAuthorGenreInsert = typeof authorGenreTable.$inferInsert;
export type TAuthorGenreSelect = typeof authorGenreTable.$inferSelect;

export type TBookInsert = typeof bookTable.$inferInsert;
export type TBookSelect = typeof bookTable.$inferSelect;

export type TBookOwnerInsert = typeof bookOwnerTable.$inferInsert;
export type TBookOwnerSelect = typeof bookOwnerTable.$inferSelect;

// 🔹 Relations (updated for string FK in bookOwner)
export const genreAuthorsRelation = relations(genreTable, ({ many }) => ({
  authors: many(authorTable),
  authorGenres: many(authorGenreTable)
}));

export const authorGenreRelation = relations(authorTable, ({ one, many }) => ({
  genre: one(genreTable, {
    fields: [authorTable.genreId],
    references: [genreTable.genreId]
  }),
  authorGenres: many(authorGenreTable),
  books: many(bookTable)
}));

export const authorGenreRelations = relations(authorGenreTable, ({ one }) => ({
  author: one(authorTable, {
    fields: [authorGenreTable.authorId],
    references: [authorTable.authorId]
  }),
  genre: one(genreTable, {
    fields: [authorGenreTable.genreId],
    references: [genreTable.genreId]
  })
}));

export const bookRelations = relations(bookTable, ({ one, many }) => ({
  author: one(authorTable, {
    fields: [bookTable.authorId],
    references: [authorTable.authorId]
  }),
  owners: many(bookOwnerTable)
}));

export const bookOwnerRelations = relations(bookOwnerTable, ({ one }) => ({
  book: one(bookTable, {
    fields: [bookOwnerTable.bookId],
    references: [bookTable.bookId]
  }),
  user: one(userTable, {
    fields: [bookOwnerTable.ownerId],
    references: [userTable.userId]
  })
}));

export const userRelations = relations(userTable, ({ many }) => ({
  ownedBooks: many(bookOwnerTable)
}));
