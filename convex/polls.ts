import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const polls = await ctx.db.query("polls").collect();
    return polls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
    author: v.string(),
  },
  handler: async (ctx, { question, options, author }) => {
    const id = `p_${Date.now()}`;
    return await ctx.db.insert("polls", {
      question,
      options: options.map((t, i) => ({
        id: `${id}_o${i}`,
        text: t,
        voters: [],
      })),
      author,
      createdAt: Date.now(),
    });
  },
});

export const vote = mutation({
  args: {
    id: v.id("polls"),
    optionId: v.string(),
    user: v.string(),
  },
  handler: async (ctx, { id, optionId, user }) => {
    const poll = await ctx.db.get(id);
    if (!poll) return;
    type PollOpt = { id: string; text: string; voters: string[] };
    const opts = poll.options as PollOpt[];
    const currentlyVotedOpt = opts.find((o) => o.voters.includes(user));
    // toggle off if clicking same option
    const isToggleOff = currentlyVotedOpt?.id === optionId;
    const nextOptions = opts.map((o) => {
      const without = o.voters.filter((v: string) => v !== user);
      if (!isToggleOff && o.id === optionId) {
        return { ...o, voters: [...without, user] };
      }
      return { ...o, voters: without };
    });
    await ctx.db.patch(id, { options: nextOptions });
  },
});

export const remove = mutation({
  args: { id: v.id("polls") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const seed = mutation({
  args: {
    polls: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        author: v.string(),
      })
    ),
  },
  handler: async (ctx, { polls }) => {
    const existing = await ctx.db.query("polls").collect();
    if (existing.length > 0) return { skipped: true };
    for (const p of polls) {
      const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await ctx.db.insert("polls", {
        question: p.question,
        options: p.options.map((t, i) => ({
          id: `${id}_o${i}`,
          text: t,
          voters: [],
        })),
        author: p.author,
        createdAt: Date.now(),
      });
    }
    return { seeded: polls.length };
  },
});
