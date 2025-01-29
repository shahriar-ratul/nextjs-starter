'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import ability from '@/services/guard/ability';
import React from 'react';
import Forbidden from '../errorPage/Forbidden';
const breadcrumbItems = [{ title: 'Dashboard', link: '/dashboard' }];
const Dashboard = () => {
	return (
		<>
			{ability.can('admin.dashboard', '') ? (
				<>
					<div className="flex-1 space-y-4 p-2 md:px-0 pt-8 ">
						<BreadCrumb items={breadcrumbItems} />
					</div>
				</>
			) : (
				<Forbidden />
			)}
		</>
	);
};

export default Dashboard;
