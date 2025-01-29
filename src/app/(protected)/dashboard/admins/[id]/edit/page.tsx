'use client';
import UpdateAdmin from '@/modules/admin/update-admin/UpdateAdmin';
import Forbidden from '@/modules/errorPage/Forbidden';
import ability from '@/services/guard/ability';
import { useParams } from 'next/navigation';
import React from 'react';

export default function UpdateAdminPage() {
	const params = useParams<{ id: string }>();

	return <>{ability.can('admin.update', '') ? <UpdateAdmin id={params.id} /> : <Forbidden />}</>;
}
