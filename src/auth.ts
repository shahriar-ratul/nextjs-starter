import axios from 'axios';
import type { NextAuthConfig, Session } from 'next-auth';
import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextRequest } from 'next/server';

declare module 'next-auth' {
	interface Session {
		user: {
			accessToken?: string;
			refreshToken?: string;
			expiresIn?: number;
			id: string;
			name: string;
			username: string;
			email: string;
			phone: string;
			photo: string;
			isActive: boolean;
			createdAt: string;
			updatedAt: string;
			roles: {
				roleId: string;
				role: {
					id: string;
					isActive: boolean;
					name: string;
					slug: string;
				};
			}[];
			permissions: string[];
		};
	}

	interface User {
		accessToken: string;
		refreshToken: string;
		permissions: string[];
		data: Session['user'];
	}
}

export class CustomAuthError extends AuthError {
	static type: string;

	constructor(message?: any) {
		super();
		this.type = message;
	}
}

export const authConfig = {
	debug: false,
	pages: {
		signIn: '/login',
		error: '/login',
	},
	events: {},
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				username: {},
				password: {},
			},
			async authorize(credentials: Partial<Record<'username' | 'password', unknown>>) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}
				const { username, password } = credentials;

				const body = {
					username,
					password,
				};

				try {
					const res = await axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
						body,
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					);

					// add time plus expiresIn to get the expiration time
					const time = Number(res.data.data.expiresIn) + Number(new Date().getTime());

					let data = {
						...res.data.data,
						expired_at: time,
						exp: Number(res.data.data.expiresIn),
					};

					try {
						const userResponse = await axios.get(
							`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`,
							{
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${res.data.data.accessToken}`,
								},
							},
						);

						data = {
							...data,
							user: userResponse.data.data,
						};
					} catch (err) {
						console.log(err);
					}

					return data;
				} catch (error: any) {
					let message = 'An error occurred while logging in. Please try again later.';

					if (error.response.data.message && typeof error.response.data.message === 'string') {
						message = error.response.data.message;
					} else {
						if (typeof error.response.data.message === 'object') {
							message = error.response.data.message.join('\n');
						}
					}

					throw new CustomAuthError(message);
				} finally {
					console.log('login api call finished');
				}
			},
		}),
	],
	callbacks: {
		async authorized(_params: { auth: Session | null; request: NextRequest }) {
			return true;
		},

		async session({ session, token }: { session: Session; token: any }) {
			if (token) {
				const user = {
					...token.user.data,
					permissions: token.user.permissions,
					accessToken: token.accessToken,
					refreshToken: token.refreshToken,
				};

				session.user = user;
			}
			return session;
		},
		async jwt({ token, user }) {
			// console.log("jwt", token, user);

			if (user) {
				token = {
					...token,
					...user,
				};
			}

			if (token.expired_at && new Date().getTime() < Number(token.expired_at)) {
				return token;
			}
			return null;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
