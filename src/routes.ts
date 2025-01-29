const excludedRoutesRegex = /^\/(?:api|admin)(\/|$)/;

// Function to check if a route is public
export const isCurrentPublicRoute = (route: string): boolean => {
	return !excludedRoutesRegex.test(route);
};

export const publicRoutes = ['/', '/contact'];

export const authRoutes = ['/login'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
