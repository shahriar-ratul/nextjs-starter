import Home from '@/app/(public)/page';
import Hero from '@/modules/front/Hero';
import { render, screen } from '@testing-library/react';

describe('Home Page Rendering', () => {
	it('should pass', () => {
		render(<Hero />);
		expect(screen.getByText('This is something')).toBeInTheDocument();
	});
});
