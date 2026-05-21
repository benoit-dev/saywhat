import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Single-trip schema (Matawinie · 22-24 mai 2026).
// Pas de notion de Trip pour l'instant — on hardcode pour ce weekend.

export default defineSchema({
  // Items de courses ajoutés manuellement par les utilisateurs
  coursesManual: defineTable({
    name: v.string(),
    cat: v.string(),
    qty: v.optional(v.string()),
    done: v.boolean(),
    assigned: v.optional(v.string()),
    addedBy: v.string(),
  }),

  // Modifications appliquées aux items auto-générés (clé = autoId stable)
  coursesOverrides: defineTable({
    autoId: v.string(),
    done: v.optional(v.boolean()),
    assigned: v.optional(v.string()),
    deleted: v.optional(v.boolean()),
    qtyNum: v.optional(v.string()),
    qtyUnit: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("by_autoId", ["autoId"]),

  // Qui prend quoi
  groupItems: defineTable({
    name: v.string(),
    note: v.optional(v.string()),
    assigned: v.optional(v.string()),
    addedBy: v.optional(v.string()),
  }),

  // Voitures
  cars: defineTable({
    name: v.string(),
    color: v.string(),
    driver: v.string(),
    pax: v.array(v.string()),
  }),

  // Randos (votes)
  randos: defineTable({
    name: v.string(),
    place: v.string(),
    distance: v.string(),
    difficulty: v.string(),
    length: v.string(),
    note: v.string(),
    rating: v.number(),
    url: v.string(),
    votes: v.array(v.string()),
  }),

  // Sondages
  polls: defineTable({
    question: v.string(),
    options: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        voters: v.array(v.string()),
      })
    ),
    author: v.string(),
    createdAt: v.number(),
  }),

  // Wall : citations & moments
  wallItems: defineTable({
    text: v.string(),
    attrib: v.optional(v.string()),
    author: v.string(),
    createdAt: v.number(),
    likes: v.array(v.string()),
  }),

  // Photos (storage Convex)
  photos: defineTable({
    author: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  }).index("by_author", ["author"]),

  // Check-list perso par user (composite "user|item")
  persos: defineTable({
    user: v.string(),
    item: v.string(),
    done: v.boolean(),
  }).index("by_user", ["user"]),
});
