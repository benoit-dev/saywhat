import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForUser = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    return await ctx.db
      .query("persos")
      .withIndex("by_user", (q) => q.eq("user", user))
      .collect();
  },
});

export const toggle = mutation({
  args: { user: v.string(), item: v.string() },
  handler: async (ctx, { user, item }) => {
    const existing = await ctx.db
      .query("persos")
      .withIndex("by_user", (q) => q.eq("user", user))
      .filter((q) => q.eq(q.field("item"), item))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { done: !existing.done });
    } else {
      await ctx.db.insert("persos", { user, item, done: true });
    }
  },
});
