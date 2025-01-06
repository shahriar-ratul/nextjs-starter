import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
	server: {
		NEXTAUTH_SECRET: z.string().optional(),
		NEXTAUTH_URL: z.string().min(1),
		AUTH_TRUST_HOST: z.string().optional(),
	},
	client: {
		NEXT_PUBLIC_BACKEND_URL: z.string().optional(),
	},
	shared: {
		NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
	},
	// You need to destructure all the keys manually
	runtimeEnv: {
		NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
		NODE_ENV: process.env.NODE_ENV,
	},
});
