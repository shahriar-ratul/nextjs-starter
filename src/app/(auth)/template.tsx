'use client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

const Template = ({ children }: { children: React.ReactNode }) => {
	const session = useSession();

	const router = useRouter();

	useEffect(() => {
		if (session.status === 'authenticated') {
			router.push(DEFAULT_LOGIN_REDIRECT);
		}
	}, [session.status]);

	return <>{children}</>;
};
export default Template;
