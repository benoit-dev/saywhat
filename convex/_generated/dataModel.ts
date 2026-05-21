/**
 * Stub fallback — sera écrasé par `npx convex dev`/`convex codegen`.
 */
import type { GenericId } from "convex/values";

export type Doc<T extends string = string> = Record<string, unknown> & { _id: Id<T>; _creationTime: number };
export type Id<T extends string = string> = GenericId<T>;
export type DataModel = Record<string, unknown>;
