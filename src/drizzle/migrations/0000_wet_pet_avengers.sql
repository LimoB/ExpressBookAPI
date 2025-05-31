CREATE TYPE "public"."userType" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "authorTable" (
	"authorId" serial PRIMARY KEY NOT NULL,
	"authorName" text,
	"genreId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
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
ALTER TABLE "authorTable" ADD CONSTRAINT "authorTable_genreId_genreTable_genreId_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genreTable"("genreId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookOwnerTable" ADD CONSTRAINT "bookOwnerTable_bookId_bookTable_bookId_fk" FOREIGN KEY ("bookId") REFERENCES "public"."bookTable"("bookId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookOwnerTable" ADD CONSTRAINT "bookOwnerTable_ownerId_userTable_userId_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookTable" ADD CONSTRAINT "bookTable_authorId_authorTable_authorId_fk" FOREIGN KEY ("authorId") REFERENCES "public"."authorTable"("authorId") ON DELETE cascade ON UPDATE no action;