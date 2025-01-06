'use client';

import type { HTMLMotionProps } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

type BottomToTopIconProps = Omit<
	HTMLMotionProps<'button'>,
	'animate' | 'initial' | 'exit' | 'whileHover' | 'whileTap'
> & {
	size?: 'default' | 'sm' | 'lg' | 'icon';
	scrollThreshold?: number;
};

export default function ScrollToTop({
	size = 'icon',
	className,
	scrollThreshold = 300,
	...props
}: BottomToTopIconProps) {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowButton(window.scrollY > scrollThreshold);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrollThreshold]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	return (
		<AnimatePresence>
			{showButton && (
				<motion.button
					onClick={(e) => {
						e.preventDefault();
						scrollToTop();
					}}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{
						type: 'keyframes',
						stiffness: 260,
						damping: 20,
					}}
					className={`
            fixed bottom-4 right-4 z-50
            flex size-12 items-center
            justify-center rounded-full border-transparent
            bg-gradient-to-r from-blue-400
            to-blue-600 text-white
            shadow-lg hover:from-blue-500 hover:to-blue-700
            hover:shadow-xl dark:from-blue-600
            dark:to-blue-800 dark:hover:from-blue-700
            dark:hover:to-blue-900
            ${className}
          `}
					{...props}>
					<ArrowUp className="size-6" />
					<span className="sr-only">Scroll to top</span>
				</motion.button>
			)}
		</AnimatePresence>
	);
}
