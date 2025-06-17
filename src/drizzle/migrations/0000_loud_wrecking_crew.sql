CREATE TYPE "public"."user_type" AS ENUM('admin', 'member', 'author');--> statement-breakpoint
CREATE TABLE "author_genre" (
	"author_genre_id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"genre_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "author" (
	"author_id" serial PRIMARY KEY NOT NULL,
	"author_name" text,
	"genre_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_owner" (
	"book_owner_id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book" (
	"book_id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"isbn" text,
	"publication_year" integer,
	"author_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"genre_id" serial PRIMARY KEY NOT NULL,
	"genre_name" text,
	"genre_code" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" text PRIMARY KEY NOT NULL,
	"full_name" varchar,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"user_type" "user_type" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "author_genre" ADD CONSTRAINT "author_genre_author_id_author_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author"("author_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_genre" ADD CONSTRAINT "author_genre_genre_id_genre_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("genre_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author" ADD CONSTRAINT "author_genre_id_genre_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("genre_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_owner" ADD CONSTRAINT "book_owner_book_id_book_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("book_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_owner" ADD CONSTRAINT "book_owner_owner_id_user_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_author_id_author_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author"("author_id") ON DELETE cascade ON UPDATE no action;