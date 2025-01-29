'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import DetailsRole from '@/modules/role/details-role/DetailsRole';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function DetailsRolePage() {
	const params = useParams<{ id: string }>();

	return <>{ability.can('role.view', '') ? <DetailsRole id={params.id} /> : <Forbidden />}</>;
}
