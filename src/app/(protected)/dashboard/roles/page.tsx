'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import RoleList from '@/modules/role/RoleList';
import ability from '@/services/guard/ability';
import React from 'react';

export default function RolePage() {
	return <>{ability.can('role.view', '') ? <RoleList /> : <Forbidden />}</>;
}
