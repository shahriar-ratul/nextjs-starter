'use client';
import { type Variants, motion } from 'framer-motion';
import React, { useState } from 'react';

interface AnimatedLetterProps {
	character: string;
	animation: Variants;
}

export const AnimatedLetter = ({ character, animation }: AnimatedLetterProps) => {
	return (
		<motion.span variants={animation} className="relative inline-block whitespace-nowrap">
			{character}
		</motion.span>
	);
};
