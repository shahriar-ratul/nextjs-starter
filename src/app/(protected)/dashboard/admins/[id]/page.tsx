'use client';
import DetailsAdmin from '@/modules/admin/details-admin/DetailsAdmin';
import Forbidden from '@/modules/errorPage/Forbidden';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function DetailsAdminPage() {
	const params = useParams<{ id: string }>();

	return <>{ability.can('admin.view', '') ? <DetailsAdmin id={params.id} /> : <Forbidden />}</>;
}
