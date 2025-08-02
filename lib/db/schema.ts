import { integer, text, pgTable } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
  id: integer("id"),
  user_id: text("user_id").primaryKey().notNull(),
  domain: text("domain").notNull(),
});
