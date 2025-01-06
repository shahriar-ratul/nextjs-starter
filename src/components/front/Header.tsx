'use client';

import Loader from '@/app/(public)/loading';
import { Button } from '@/components/ui/button';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
	{ name: 'Home', href: '/' },
	// { name: "Projects", href: "/projects" },
	// { name: "Blog", href: "/blog" },
	// { name: "Contact", href: "/contact" },
];

interface HeaderProps {
	loader?: boolean;
}

export default function Header({ loader }: HeaderProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useScroll();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useMotionValueEvent(scrollY, 'change', (latest) => {
		setIsScrolled(latest > 50);
	});

	return (
		<>
			{loader && <Loader />}
			<motion.header
				className={`fixed inset-x-0 top-0 z-50 bg-background/80  transition-all duration-200 ${
					isScrolled ? 'py-2 shadow-md' : 'py-6'
				}`}
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					delay: loader ? 1.5 : 0.5,
					duration: 0.5,
				}}>
				<div className="mx-auto flex w-full max-w-[1920px] items-center justify-evenly px-4 sm:px-6 lg:px-8">
					{/* <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Atik Shahriar Ratul
          </motion.div> */}

					{/* Desktop Navigation */}
					<nav className="hidden md:block">
						<ul className="flex space-x-6">
							{navItems.map((item, index) => (
								<motion.li
									key={item.name}
									onHoverStart={() => setHoveredIndex(index)}
									onHoverEnd={() => setHoveredIndex(null)}>
									<Link
										href={item.href}
										className="text-foreground transition-colors hover:text-primary">
										{item.name}
										{hoveredIndex === index && (
											<motion.div
												className="h-0.5 bg-primary"
												layoutId="underline"
												initial={{ width: 0 }}
												animate={{ width: '100%' }}
												transition={{
													type: 'spring',
													stiffness: 300,
													damping: 30,
												}}
											/>
										)}
									</Link>
								</motion.li>
							))}
						</ul>
					</nav>

					{/* Mobile Navigation Button */}
					<Button
						variant="secondary"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>

					{/* Get Started Button - Hide on Mobile */}
					{/* <motion.div
            className="hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button>Get Started</Button>
          </motion.div> */}
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="absolute inset-x-0 top-full border-t bg-background md:hidden">
						<div className="p-4">
							<ul className="flex flex-col space-y-4">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="block text-foreground transition-colors hover:text-primary"
											onClick={() => setIsMobileMenuOpen(false)}>
											{item.name}
										</Link>
									</li>
								))}
								{/* <li className="pt-4">
                  <Button className="w-full">Get Started</Button>
                </li> */}
							</ul>
						</div>
					</div>
				)}
			</motion.header>
		</>
	);
}
