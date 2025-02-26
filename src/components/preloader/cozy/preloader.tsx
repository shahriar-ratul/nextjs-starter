'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { opacity, slideUp } from './anim';

interface PreloaderProps {
	progress: number;
}

export function Preloader({ progress }: PreloaderProps) {
	const [dimension, setDimension] = useState({ width: 0, height: 0 });

	useEffect(() => {
		setDimension({ width: window.innerWidth, height: window.innerHeight });
	}, []);

	const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
	const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

	const curve = {
		initial: {
			d: initialPath,
			transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
		},
		exit: {
			d: targetPath,
			transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
		},
	};

	return (
		<motion.div
			variants={slideUp}
			initial="initial"
			exit="exit"
			className="fixed z-30 flex h-dvh w-dvw cursor-wait items-end justify-end bg-background px-[60px] pb-[40px]">
			{dimension.width > 0 && (
				<>
					<motion.p
						variants={opacity}
						initial="initial"
						animate="enter"
						className="absolute z-[1] flex items-center text-7xl text-foreground">
						{progress}%
					</motion.p>
					<svg className="absolute top-0 h-[calc(100%+300px)] w-full">
						<motion.path
							variants={curve}
							initial="initial"
							exit="exit"
							className="fill-background"></motion.path>
					</svg>
				</>
			)}
		</motion.div>
	);
}
