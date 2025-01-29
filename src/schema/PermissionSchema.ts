import { z } from 'zod';

export const Permission = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	group: z.string(),
	groupOrder: z.number(),
	order: z.number(),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	adminCount: z.number(),
	roleCount: z.number(),
	roles: z.array(
		z.object({
			permissionId: z.number(),
			roleId: z.number(),
			createdAt: z.string(),
			updatedAt: z.string(),
			role: z.object({
				id: z.number(),
				name: z.string(),
				slug: z.string(),
				description: z.string(),
				isDefault: z.boolean(),
				isActive: z.boolean(),
				createdAt: z.string(),
				updatedAt: z.string(),
			}),
		}),
	),
});

export type PermissionModel = z.infer<typeof Permission>;
