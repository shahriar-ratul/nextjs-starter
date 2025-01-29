import Loader from '@/app/(public)/loading';
import { auth } from '@/auth';
import { LoginForm } from '@/components/forms/login-form';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
	const session = await auth();

	if (session?.user) {
		return redirect(DEFAULT_LOGIN_REDIRECT);
	}

	return (
		<>
			{session?.user ? (
				<Loader />
			) : (
				<div className="flex h-screen w-full items-center justify-center px-4">
					<LoginForm />
				</div>
			)}
		</>
	);
}
