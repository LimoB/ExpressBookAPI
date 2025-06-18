import {
  pgTable,
  text,
  varchar,
  integer,
  serial,
  timestamp,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 🔷 ENUM: User roles
export const roleEnum = pgEnum("user_type", ["admin", "member", "author"]);

// 🧑‍💼 User Table
export const userTable = pgTable("user", {
  userId: text("user_id").primaryKey(), // UUID from JWT
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  userType: roleEnum("user_type").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// 🎭 Genre Table
export const genreTable = pgTable("genre", {
  genreId: serial("genre_id").primaryKey(),
  genreName: varchar("genre_name", { length: 100 }).notNull(),
  genreCode: varchar("genre_code", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// ✍️ Author Table
export const authorTable = pgTable("author", {
  authorId: serial("author_id").primaryKey(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  genreId: integer("genre_id").references(() => genreTable.genreId).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// 🔗 Author-Genre Bridge Table
export const authorGenreTable = pgTable("author_genre", {
  authorGenreId: serial("author_genre_id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => authorTable.authorId, { onDelete: "cascade" }),
  genreId: integer("genre_id").notNull().references(() => genreTable.genreId, { onDelete: "cascade" })
});

// 📚 Book Table
export const bookTable = pgTable("book", {
  bookId: serial("book_id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  isbn: varchar("isbn", { length: 20 }),
  publicationYear: integer("publication_year"),
  authorId: integer("author_id").notNull().references(() => authorTable.authorId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// 🤝 Book Owner Table
export const bookOwnerTable = pgTable("book_owner", {
  bookOwnerId: serial("book_owner_id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => bookTable.bookId, { onDelete: "cascade" }),
  ownerId: text("owner_id").notNull().references(() => userTable.userId, { onDelete: "cascade" })
});



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
