/**
 * Stub fallback — sera écrasé par `npx convex dev`/`convex codegen`.
 * Type-safety partielle en attendant le vrai codegen.
 */
import { anyApi } from "convex/server";
import type { AnyApi } from "convex/server";

export const api: AnyApi = anyApi;
export const internal: AnyApi = anyApi;
