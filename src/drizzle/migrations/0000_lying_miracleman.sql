CREATE TYPE "public"."userType" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "author" (
	"author_id" serial PRIMARY KEY NOT NULL,
	"author_name" text,
	"genre_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authorGenreTable" (
	"authorGenreId" serial PRIMARY KEY NOT NULL,
	"authorId" integer NOT NULL,
	"genreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookOwnerTable" (
	"bookOwnerId" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"ownerId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookTable" (
	"bookId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"isbn" text,
	"publicationYear" integer,
	"authorId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "genreTable" (
	"genreId" serial PRIMARY KEY NOT NULL,
	"genreName" text,
	"genreCode" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"userId" serial PRIMARY KEY NOT NULL,
	"fullName" varchar,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"userType" "userType" DEFAULT 'member' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "author" ADD CONSTRAINT "author_genre_id_genreTable_genreId_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genreTable"("genreId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorGenreTable" ADD CONSTRAINT "authorGenreTable_authorId_author_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("author_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorGenreTable" ADD CONSTRAINT "authorGenreTable_genreId_genreTable_genreId_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genreTable"("genreId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookOwnerTable" ADD CONSTRAINT "bookOwnerTable_bookId_bookTable_bookId_fk" FOREIGN KEY ("bookId") REFERENCES "public"."bookTable"("bookId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookOwnerTable" ADD CONSTRAINT "bookOwnerTable_ownerId_userTable_userId_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookTable" ADD CONSTRAINT "bookTable_authorId_author_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("author_id") ON DELETE cascade ON UPDATE no action;