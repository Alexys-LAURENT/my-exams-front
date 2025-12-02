'use client';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
	const [form, setform] = useState({
		email: '',
		password: '',
		is_email_invalid: false,
	});
	const [loading, setLoading] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const callbackUrl = useSearchParams().get('callbackUrl') || '/';

	const errorCode = decodeURI(useSearchParams().get('code') || '');
	const successMessage = decodeURI(useSearchParams().get('success') || '');
	const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		signIn('credentials', { email: form.email, password: form.password, redirect: true, callbackUrl: callbackUrl });
	};

	return (
		<div className="flex items-center justify-center w-full h-screen bg-blue-50">
			<div className="flex flex-col items-center w-full max-w-[450px] mx-4">
				<div className="flex flex-col items-center mb-8">
					<div className="bg-blue-600 p-4 rounded-md mb-3">
						<AcademicCapIcon className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold">My Exams</h1>
				</div>
				<div className="bg-white w-full p-8 rounded-lg shadow-md">
					<h2 className="text-xl font-medium text-center mb-8">Connexion</h2>
					<form onSubmit={handlesubmit} className="flex flex-col gap-5 w-full">
						<div className="flex flex-col gap-2">
							<label htmlFor="email" className="text-sm font-medium text-gray-600">
								Email
							</label>
							<Input
								isInvalid={form.is_email_invalid}
								errorMessage="Email invalide"
								autoComplete="email"
								type="text"
								onBlur={() => {
									// eslint-disable-next-line @typescript-eslint/no-unused-expressions
									!form.email.includes('@') || !form.email.includes('.')
										? setform((prev) => ({ ...prev, is_email_invalid: true }))
										: setform((prev) => ({ ...prev, is_email_invalid: false }));
								}}
								name="email"
								placeholder="votre.email@exemple.com"
								aria-label="Email"
								value={form.email}
								onChange={(e) => setform((prev) => ({ ...prev, email: e.target.value }))}
								className="h-12"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="password" className="text-sm font-medium text-gray-600">
								Mot de passe
							</label>
							<Input
								type={isPasswordVisible ? 'text' : 'password'}
								name="password"
								autoComplete="current-password"
								aria-label="Mot de passe"
								placeholder="********"
								value={form.password}
								onChange={(e) => setform((prev) => ({ ...prev, password: e.target.value }))}
								endContent={
									isPasswordVisible ? (
										<EyeSlashIcon className="w-5 h-5 cursor-pointer text-gray-400" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
									) : (
										<EyeIcon className="w-5 h-5 cursor-pointer text-gray-400" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
									)
								}
								className="h-12"
							/>
						</div>
						<div className="flex items-center justify-between my-3">
							<a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
								Mot de passe oublié ?
							</a>
						</div>
						{errorCode && errorCode === 'invalid_credentials' && <p className="text-red-500 text-center text-sm">Email ou mot de passe incorrect</p>}
						{errorCode && errorCode === 'no_account' && <p className="text-red-500 text-center text-sm">Aucun compte trouvé avec cet email</p>}
						{successMessage && <p className="text-green-500 text-center text-sm">{successMessage}</p>}
						<Button
							isLoading={loading}
							disabled={form.is_email_invalid === true || !form.email || !form.password}
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium rounded-md mt-4 w-full"
						>
							Se connecter
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Page;
