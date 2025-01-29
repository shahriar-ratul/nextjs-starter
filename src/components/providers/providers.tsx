'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import AbilityProvider from './AbilityProvider';
import QueryProvider from './QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
			<AbilityProvider>
				<QueryProvider>
					<TooltipProvider>{children}</TooltipProvider>
				</QueryProvider>
			</AbilityProvider>
		</ThemeProvider>
	);
}
