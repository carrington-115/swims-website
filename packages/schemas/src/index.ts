/**
 * Single source of truth for the SWIMS blog content model.
 *
 * The API validates requests with these schemas, and both frontends type their
 * responses from them, so a change to the model surfaces as a type error rather
 * than a runtime surprise. Types are derived with z.infer -- never hand-written
 * alongside the schema -- so the two cannot drift.
 *
 * Deliberately not exported from here: the Express `Request.userId` global
 * augmentation and the Supabase `Database` row types. Both are API-internal;
 * re-exporting them would leak Express and Postgres types into the Next apps.
 */
export * from "./blog";
export * from "./section";
export * from "./toc";
export * from "./params";
export * from "./api";
