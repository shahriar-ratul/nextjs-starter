import Footer from '@/components/front/Footer';
import Header from '@/components/front/Header';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="relative bg-gray-50 pt-20 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 sm:pt-24">
				<Header loader />
				<main className="">
					{children}
					<Footer />
				</main>
			</div>
		</>
	);
}
