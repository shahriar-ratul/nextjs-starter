'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import UpdateRole from '@/modules/role/update-role/UpdateRole';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function UpdateRolePage() {
	const params = useParams<{ id: string }>();

	return <>{ability.can('role.update', '') ? <UpdateRole id={params.id} /> : <Forbidden />}</>;
}
