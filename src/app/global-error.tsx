'use client';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		// global-error must include html and body tags
		<html lang="en">
			<body>
				<h2>Something went wrong!</h2>
				<p>Error :{JSON.stringify(error)}</p>
				<p>{error.message}</p>
				<button type="button" onClick={() => reset()}>
					Try again
				</button>
			</body>
		</html>
	);
}
