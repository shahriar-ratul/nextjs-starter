import { auth } from 'auth';
import { type NextRequest, NextResponse } from 'next/server';
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	isCurrentPublicRoute,
	publicRoutes,
} from './routes';

export default auth((req) => {
	const isLoggedIn = !!req.auth;

	const { nextUrl } = req;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isCurrentPublicRoute(nextUrl.pathname)) {
		return;
	}

	if (isPublicRoute) {
		return;
	}

	if (isApiAuthRoute) {
		return;
	}

	if (isAuthRoute && !isLoggedIn) {
		return;
	}

	if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute && !isAuthRoute) {
		let callbackUrl = nextUrl.pathname;
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
	}

	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
	}
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)'],
};
