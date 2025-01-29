import Footer from '@/components/userPortal/Footer';
import Header from '@/components/userPortal/Header';
import { ModeToggle } from '@/components/userPortal/mode-toggle';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="relative bg-gray-50 pt-20 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 sm:pt-24">
				<Header />
				<main className="">{children}</main>
				<Footer />
				<ModeToggle />
			</div>
		</>
	);
}
