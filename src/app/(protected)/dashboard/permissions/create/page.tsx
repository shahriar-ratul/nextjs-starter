'use client';
import Forbidden from '@/modules/errorPage/Forbidden';
import AddPermission from '@/modules/permission/add-permission/AddPermission';
import ability from '@/services/guard/ability';
import React from 'react';

export default function Create() {
	return <>{ability.can('permission.create', '') ? <AddPermission /> : <Forbidden />}</>;
}
