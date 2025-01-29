import ScrollToTop from '@/components/bottom-to-top';
import Providers from '@/components/providers/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Bricolage_Grotesque } from 'next/font/google';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const bricolage_grotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Next js Starter',
	description: 'Next js Starter',
	icons: {
		icon: '/images/logo/logo.png',
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={bricolage_grotesque.className}>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						{children}
						<Toaster />
						<ScrollToTop />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
