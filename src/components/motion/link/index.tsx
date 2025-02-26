'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import React, { useState, useId, ReactNode } from 'react';
import { letterAnimation, letterAnimationTwo } from './anim';
import { AnimatedWord } from './word';

type AnimatedLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
	LinkProps & {
		children?: React.ReactNode | undefined;
	} & React.RefAttributes<HTMLAnchorElement>;

export default function AnimatedLink({ href, children, ...props }: AnimatedLinkProps) {
	const [isHovered, setIsHovered] = useState(false);

	const processChildren = (child: React.ReactNode): React.ReactNode => {
		if (typeof child === 'string') {
			return child.split(' ').map((word, index, array) => (
				<React.Fragment key={`word-${index}`}>
					<motion.div
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						className="relative cursor-pointer overflow-hidden">
						<AnimatedWord title={word} animation={letterAnimation} isHovered={isHovered} />
						<div className="absolute top-0">
							<AnimatedWord title={word} animation={letterAnimationTwo} isHovered={isHovered} />
						</div>
					</motion.div>
					{index < array.length - 1 && <span key={`space-${index}`}>&nbsp;</span>}
				</React.Fragment>
			));
		} else if (React.isValidElement(child)) {
			const element = child as React.ReactElement & {
				props?: {
					children?: React.ReactNode;
				};
			};

			if (element.props && 'children' in element.props) {
				return React.cloneElement(element, {}, processChildren(element.props.children));
			}
			return element;
		} else if (Array.isArray(child)) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return child.map((nestedChild: any, index: number) => (
				<React.Fragment key={`nested-${index}`}>{processChildren(nestedChild)}</React.Fragment>
			));
		}
		return child;
	};

	return (
		<Link href={href} {...props}>
			{processChildren(children)}
		</Link>
	);
}
