'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import DetailsPermission from '@/modules/permission/details-permission/DetailsPermission';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function DetailsPermissionPage() {
	const params = useParams<{ id: string }>();
	const permissionId = Number.parseInt(params.id);

	return (
		<>
			{ability.can('permission.view', '') ? <DetailsPermission id={permissionId} /> : <Forbidden />}
		</>
	);
}
