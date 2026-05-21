import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("groupItems").collect();
  },
});

export const add = mutation({
  args: { name: v.string(), addedBy: v.string() },
  handler: async (ctx, { name, addedBy }) => {
    return await ctx.db.insert("groupItems", { name, note: "", addedBy });
  },
});

export const setAssigned = mutation({
  args: {
    id: v.id("groupItems"),
    assigned: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { id, assigned }) => {
    await ctx.db.patch(id, { assigned: assigned ?? undefined });
  },
});

export const remove = mutation({
  args: { id: v.id("groupItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const seed = mutation({
  args: {
    items: v.array(
      v.object({
        name: v.string(),
        note: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { items }) => {
    const existing = await ctx.db.query("groupItems").collect();
    if (existing.length > 0) return { skipped: true };
    for (const it of items) {
      await ctx.db.insert("groupItems", { name: it.name, note: it.note ?? "" });
    }
    return { seeded: items.length };
  },
});
