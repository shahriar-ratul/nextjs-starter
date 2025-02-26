import Link from 'next/link';
import type React from 'react';

type NotFoundStateProps = {
	error: Error;
};

const NotFound: React.FC<NotFoundStateProps> = () => {
	return (
		<div className="flex min-h-screen grow items-center justify-center bg-gray-50">
			<div className="rounded-lg bg-white p-8 text-center shadow-xl">
				<h1 className="mb-4 text-4xl font-bold">404</h1>
				<p className="text-gray-600">Oops! The page you are looking for could not be found.</p>
				<Link
					href="/"
					className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
					{' '}
					Go back to Home{' '}
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
