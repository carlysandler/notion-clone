import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

export const get = query({
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity()
		if (!user) {
			throw new Error("User is not authenticated")
		}
		const documents = await ctx.db.query("documents").collect()
		return documents

	}
})
export const getSidebar = query({
	args: {
		parentDocument: v.optional(v.id("documents"))
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity()
		if (!user) {
			throw new Error("User is not authenticated")
		}
		const userId = user.subject

		const documents = ctx.db
			.query("documents")
			.withIndex("by_user_parent", (q) =>
				q
				.eq("userId", userId)
				.eq("parentDocument", args.parentDocument)
				
			)
			.filter((q) => 
				q.eq(q.field("isArchived"), false)
			)
			.order("desc")
			.collect()
		return documents
	}
})

export const create = mutation({
	args: {
		title: v.string(),
		parentDocument: v.optional(v.id("documents"))
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity()
		if (!user) {
			throw new Error("User is not authenticated")
		}
		const userId = user.subject

		const document = await ctx.db.insert("documents", {
			title: args.title,
			parentDocument: args.parentDocument,
			userId,
			isArchived: false,
			isPublished: false
		})

		return document
	}
})
