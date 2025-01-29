import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import AppLoader from './AppLoader';

interface LoadingModalProps {
	isOpen: boolean;
	text?: string;
	description?: string;
	className?: string;
}

export function LoadingModal({
	isOpen,
	text = 'Please wait',
	description = "This won't take long...",
	className,
}: LoadingModalProps) {
	return (
		<Dialog open={isOpen}>
			<DialogTitle className="sr-only">Loading Status</DialogTitle>
			<DialogDescription className="sr-only">Loading Status</DialogDescription>

			<DialogContent
				className={cn(
					'sm:max-w-[400px] flex flex-col items-center gap-6 p-12',
					'bg-gradient-to-b from-background to-background/80',
					'backdrop-blur-sm border-muted/20',
					'[&>button:last-child]:hidden',
					className,
				)}>
				<div className="relative">
					{/* Outer glow effect */}
					<div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse" />

					{/* Main loader */}
					<AppLoader
						size="lg"
						className="relative z-10 [&>div]:border-[3px] [&>div]:w-12 [&>div]:h-12"
					/>
				</div>

				<div className="space-y-2 text-center">
					<h3 className="font-semibold text-lg tracking-tight">{text}</h3>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>

				{/* Decorative dots */}
				<div className="flex gap-1.5 mt-2">
					<div
						className="w-4 h-4 rounded-full bg-slate-500 animate-bounce"
						style={{ animationDelay: '0ms' }}
					/>
					<div
						className="w-4 h-4 rounded-full bg-slate-500 animate-bounce"
						style={{ animationDelay: '150ms' }}
					/>
					<div
						className="w-4 h-4 rounded-full bg-slate-500 animate-bounce"
						style={{ animationDelay: '300ms' }}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
