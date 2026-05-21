import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("wallItems").collect();
    return items.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const add = mutation({
  args: {
    text: v.string(),
    attrib: v.optional(v.string()),
    author: v.string(),
  },
  handler: async (ctx, { text, attrib, author }) => {
    return await ctx.db.insert("wallItems", {
      text,
      attrib,
      author,
      createdAt: Date.now(),
      likes: [],
    });
  },
});

export const toggleLike = mutation({
  args: { id: v.id("wallItems"), user: v.string() },
  handler: async (ctx, { id, user }) => {
    const item = await ctx.db.get(id);
    if (!item) return;
    const next = item.likes.includes(user)
      ? item.likes.filter((u: string) => u !== user)
      : [...item.likes, user];
    await ctx.db.patch(id, { likes: next });
  },
});

export const remove = mutation({
  args: { id: v.id("wallItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
