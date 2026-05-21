import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cars").collect();
  },
});

export const boardCar = mutation({
  args: { carId: v.id("cars"), user: v.string() },
  handler: async (ctx, { carId, user }) => {
    // Remove from every car first
    const all = await ctx.db.query("cars").collect();
    for (const c of all) {
      if (c.pax.includes(user)) {
        await ctx.db.patch(c._id, { pax: c.pax.filter((p: string) => p !== user) });
      }
    }
    // Board target
    const target = await ctx.db.get(carId);
    if (!target) return;
    if (target.driver === user) return;
    if (!target.pax.includes(user)) {
      await ctx.db.patch(carId, { pax: [...target.pax, user] });
    }
  },
});

export const leaveCar = mutation({
  args: { carId: v.id("cars"), user: v.string() },
  handler: async (ctx, { carId, user }) => {
    const car = await ctx.db.get(carId);
    if (!car) return;
    await ctx.db.patch(carId, { pax: car.pax.filter((p: string) => p !== user) });
  },
});

export const seed = mutation({
  args: {
    cars: v.array(
      v.object({
        name: v.string(),
        color: v.string(),
        driver: v.string(),
        pax: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, { cars }) => {
    const existing = await ctx.db.query("cars").collect();
    if (existing.length > 0) return { skipped: true };
    for (const c of cars) await ctx.db.insert("cars", c);
    return { seeded: cars.length };
  },
});
