import { getRequestConfig } from 'next-intl/server';

// Using internationalization in Server Components
export default getRequestConfig(async () => {
	// This typically corresponds to the `[locale]` segment
	const locale = 'en';

	return {
		locale,
		messages: (await import(`../locales/${locale}.json`)).default,
	};
});
