import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db.query("photos").collect();
    const withUrl = await Promise.all(
      photos.map(async (p) => ({
        ...p,
        url: await ctx.storage.getUrl(p.storageId),
      }))
    );
    return withUrl.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const registerUpload = mutation({
  args: {
    storageId: v.id("_storage"),
    author: v.string(),
  },
  handler: async (ctx, { storageId, author }) => {
    return await ctx.db.insert("photos", {
      storageId,
      author,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("photos") },
  handler: async (ctx, { id }) => {
    const photo = await ctx.db.get(id);
    if (!photo) return;
    try {
      await ctx.storage.delete(photo.storageId);
    } catch {
      // storage may already be gone — ignore
    }
    await ctx.db.delete(id);
  },
});
