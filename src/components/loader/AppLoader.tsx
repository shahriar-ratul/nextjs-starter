import { cn } from '@/lib/utils';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: 'sm' | 'md' | 'lg';
}

export default function AppLoader({ size = 'md', className, ...props }: LoaderProps) {
	return (
		<div role="status" className={cn('relative', className)} {...props}>
			<div
				className={cn(
					'animate-spin rounded-full border-2',
					'border-background/10 border-t-foreground',
					size === 'sm' && 'h-4 w-4',
					size === 'md' && 'h-6 w-6',
					size === 'lg' && 'h-8 w-8',
				)}
			/>
			<span className="sr-only">Loading...</span>
		</div>
	);
}
