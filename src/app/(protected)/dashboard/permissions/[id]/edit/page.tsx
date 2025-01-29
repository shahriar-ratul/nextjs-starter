'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import UpdatePermission from '@/modules/permission/update-permission/UpdatePermission';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function UpdatePermissionPage() {
	const params = useParams<{ id: string }>();
	const permissionId = Number.parseInt(params.id);

	return (
		<>
			{ability.can('permission.update', '') ? (
				<UpdatePermission id={permissionId} />
			) : (
				<Forbidden />
			)}
		</>
	);
}
