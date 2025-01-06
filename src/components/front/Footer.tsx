'use client';
import { motion } from 'framer-motion';
import React from 'react';

function Footer() {
	return (
		<motion.footer className="flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t border-border px-4 py-6 sm:flex-row sm:justify-center md:px-6">
			<p className="text-center text-xs text-gray-500 dark:text-gray-400">
				© {new Date().getFullYear()}{' '}
				<a
					href="https://github.com/shahriar-ratul"
					className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
					target="_blank"
					rel="noopener noreferrer">
					Ratul
				</a>
				. All rights reserved.
			</p>
		</motion.footer>
	);
}

export default Footer;
