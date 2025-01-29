'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import AddRole from '@/modules/role/add-role/AddRole';
import ability from '@/services/guard/ability';
import React from 'react';

export default function CreateRolePage() {
	return <>{ability.can('role.create', '') ? <AddRole /> : <Forbidden />}</>;
}
