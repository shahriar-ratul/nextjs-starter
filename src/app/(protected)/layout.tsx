import { auth } from '@/auth';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SessionProvider } from 'next-auth/react';

import Header from '@/components/dashboard/layout/Header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<main>
						<Header />
						<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</SessionProvider>
	);
}
