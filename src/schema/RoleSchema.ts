import { z } from 'zod';

export const Role = z.object({
	id: z.number(),
	name: z.string(),
	displayName: z.null(),
	slug: z.string(),
	description: z.null(),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	permissions: z
		.array(
			z.object({
				permissionId: z.number(),
				permission: z.object({
					id: z.number(),
					name: z.string(),
					slug: z.string(),
					group: z.string(),
				}),
			}),
		)
		.optional(),
});

export type RoleModel = z.infer<typeof Role>;
