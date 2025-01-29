'use client';
import { AbilityContext } from '@/services/guard/Can';
import { AbilityBuilder, AnyAbility, createMongoAbility } from '@casl/ability';
import { useSession } from 'next-auth/react';
import { redirect, usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

function updateAbility(ability: AnyAbility, permissions: string[]) {
	const { can, rules } = new AbilityBuilder(createMongoAbility);

	if (permissions) {
		for (const permission of permissions) {
			can(permission, '');
		}
	}

	ability.update(rules);
}

const Template = ({ children }: { children: React.ReactNode }) => {
	const session = useSession();

	const router = useRouter();

	const pathName = usePathname();

	const ability = useContext(AbilityContext);

	if (session?.data?.user?.permissions && session?.data?.user?.permissions.length > 0) {
		const permissions = session?.data?.user?.permissions;

		updateAbility(ability, permissions);
	}

	useEffect(() => {
		if (session.status === 'unauthenticated') {
			router.push(`/login?callbackUrl=${pathName}`);
		}
	}, [session.status]);

	return <>{children}</>;
};
export default Template;
