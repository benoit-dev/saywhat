import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listManual = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coursesManual").collect();
  },
});

export const listOverrides = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coursesOverrides").collect();
  },
});

export const addManual = mutation({
  args: {
    name: v.string(),
    cat: v.string(),
    qty: v.optional(v.string()),
    addedBy: v.string(),
  },
  handler: async (ctx, { name, cat, qty, addedBy }) => {
    return await ctx.db.insert("coursesManual", {
      name,
      cat,
      qty,
      done: false,
      assigned: undefined,
      addedBy,
    });
  },
});

export const updateManual = mutation({
  args: {
    id: v.id("coursesManual"),
    name: v.optional(v.string()),
    qty: v.optional(v.string()),
    done: v.optional(v.boolean()),
    assigned: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { id, name, qty, done, assigned }) => {
    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name;
    if (qty !== undefined) patch.qty = qty;
    if (done !== undefined) patch.done = done;
    if (assigned !== undefined) patch.assigned = assigned ?? undefined;
    await ctx.db.patch(id, patch);
  },
});

export const deleteManual = mutation({
  args: { id: v.id("coursesManual") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const setOverride = mutation({
  args: {
    autoId: v.string(),
    done: v.optional(v.boolean()),
    assigned: v.optional(v.union(v.string(), v.null())),
    deleted: v.optional(v.boolean()),
    qtyNum: v.optional(v.string()),
    qtyUnit: v.optional(v.string()),
    name: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("coursesOverrides")
      .withIndex("by_autoId", (q) => q.eq("autoId", args.autoId))
      .first();
    const patch: Record<string, unknown> = {};
    if (args.done !== undefined) patch.done = args.done;
    if (args.assigned !== undefined) patch.assigned = args.assigned ?? undefined;
    if (args.deleted !== undefined) patch.deleted = args.deleted;
    if (args.qtyNum !== undefined) patch.qtyNum = args.qtyNum;
    if (args.qtyUnit !== undefined) patch.qtyUnit = args.qtyUnit;
    if (args.name !== undefined) {
      if (args.name === null) patch.name = undefined;
      else patch.name = args.name;
    }
    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("coursesOverrides", { autoId: args.autoId, ...patch });
    }
  },
});
