import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("randos").collect();
  },
});

export const toggleVote = mutation({
  args: { id: v.id("randos"), user: v.string() },
  handler: async (ctx, { id, user }) => {
    const r = await ctx.db.get(id);
    if (!r) return;
    const next = r.votes.includes(user)
      ? r.votes.filter((v: string) => v !== user)
      : [...r.votes, user];
    await ctx.db.patch(id, { votes: next });
  },
});

export const seed = mutation({
  args: {
    randos: v.array(
      v.object({
        name: v.string(),
        place: v.string(),
        distance: v.string(),
        difficulty: v.string(),
        length: v.string(),
        note: v.string(),
        rating: v.number(),
        url: v.string(),
      })
    ),
  },
  handler: async (ctx, { randos }) => {
    const existing = await ctx.db.query("randos").collect();
    if (existing.length > 0) return { skipped: true };
    for (const r of randos) {
      await ctx.db.insert("randos", { ...r, votes: [] });
    }
    return { seeded: randos.length };
  },
});
