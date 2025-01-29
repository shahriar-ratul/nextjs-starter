'use client';
import Dashboard from '@/modules/dashboard/Dashboard';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
	const session = useSession();

	return (
		<>
			<Dashboard />
		</>
	);
}
