import { z } from 'zod';

export const AdminData = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	dob: z.string(),
	phone: z.string(),
	username: z.string(),
	email: z.string(),
	photo: z.null(),
	joinedDate: z.null(),
	gender: z.string(),
	lastLogin: z.null(),
	isVerified: z.boolean(),
	verifiedAt: z.string(),
	verifiedByEmail: z.boolean(),
	verifiedByPhone: z.boolean(),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	createdBy: z.null(),
	updatedBy: z.null(),
	deletedReason: z.null(),
	roles: z.array(
		z.object({
			adminId: z.number(),
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
				order: z.number(),
				createdAt: z.string(),
				updatedAt: z.string(),
				isDeleted: z.boolean(),
				deletedAt: z.null(),
				deletedBy: z.null(),
				deletedReason: z.null(),
			}),
		}),
	),
});

export type AdminModel = z.infer<typeof AdminData>;
