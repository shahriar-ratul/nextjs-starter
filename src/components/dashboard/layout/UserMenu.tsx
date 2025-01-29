'use client';

import { LogOut, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

interface Props {
	user: Pick<User, 'name' | 'image' | 'email'>;
}
export default function UserMenu({ user }: Props) {
	const router = useRouter();

	const handleLogOut = async () => {
		console.log('Logging out');

		await signOut({ redirect: true });

		// window.location.replace(
		//   process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/marketplace"
		// );
		// return redirect(process.env.NEXT_PUBLIC_NEXTAUTH_URL);
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Avatar className="h-8 w-8 cursor-pointer">
					{user.image ? (
						<AvatarImage src={'https://avatars.dicebear.com/api/avatars/123.svg'} alt="" />
					) : (
						<AvatarFallback>img</AvatarFallback>
					)}
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => router.push('/profile')}>
						<UserIcon className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogOut}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
