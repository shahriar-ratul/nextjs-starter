'use client';
import Loader from '@/app/(public)/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import AppLoader from '@/components/loader/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check } from 'lucide-react';
import { AuthError } from 'next-auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { LoadingModal } from '../loader/LoadingModal';

const formSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	password: z.string().min(4, {
		message: 'Password must be at least 4 characters.',
	}),
});

export function LoginForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [showError, setShowError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const { username, password } = values;

		setLoading(true);

		try {
			await signIn('credentials', {
				username,
				password,
				redirect: true,
			})
				.then((res) => {
					if (res?.error) {
						setErrorMessage(res.error);
						setShowError(true);
					}

					if (res?.ok) {
						toast('Logged in successfully', {
							className: 'bg-dark text-white',
							duration: 10000,
							position: 'top-right',
							icon: <Check className="size-4" />,
							closeButton: true,
							style: {
								padding: '1rem',
								borderRadius: '0.5rem',
								backgroundColor: 'green',
								color: '#fff',
							},
						});

						if (callbackUrl) {
							router.push(callbackUrl);
						} else {
							router.push(DEFAULT_LOGIN_REDIRECT);
						}
					}
				})
				.catch((error) => {
					console.log('error', error);
					setErrorMessage('Invalid username or password');
					setShowError(true);
				});
		} catch (error: unknown) {
			console.log('error in login form', error);
			if (error instanceof AuthError) {
				switch (error.type) {
					case 'CredentialsSignin':
						setErrorMessage('Invalid username or password');
						setShowError(true);
						break;
					case 'CallbackRouteError':
						setErrorMessage('An error occurred while logging in');
						setShowError(true);
						break;
					default:
						setErrorMessage('Error Signing in');
						setShowError(true);
						break;
				}
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<main className="flex flex-col items-center justify-center  p-24">
			<div className="flex min-h-fit flex-col justify-center space-y-2 ">
				<h1 className="text-2xl font-extrabold xl:text-3xl">Sign In</h1>
				<div className="">
					{showError && (
						<Alert variant="destructive">
							<AlertCircle className="size-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{errorMessage ?? 'Error Message'}</AlertDescription>
						</Alert>
					)}
					<LoadingModal isOpen={loading} text="Loading..." />
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="mt-10 flex w-full max-w-md flex-col gap-4">
					<Card className="mx-auto max-w-sm">
						<CardHeader>
							<CardTitle className="text-2xl">Login</CardTitle>
							<CardDescription>Enter your email below to login to your account</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => {
											return (
												<FormItem>
													<FormLabel>Email address</FormLabel>
													<FormControl>
														<Input placeholder="Email address" type="text" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => {
											return (
												<FormItem>
													<div className="flex justify-between">
														{' '}
														<FormLabel>Password</FormLabel>
														<div className="flex items-center">
															<Link href="#" className="ml-auto inline-block text-sm underline">
																Forgot your password?
															</Link>
														</div>
													</div>
													<FormControl>
														<Input placeholder="Password" type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
						</CardContent>
					</Card>
				</form>
			</Form>
		</main>
	);
}
