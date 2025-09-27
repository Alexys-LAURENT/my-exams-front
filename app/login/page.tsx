'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
	const [form, setform] = useState({
		email: '',
		password: '',
		is_email_invalid: false,
		is_password_invalid: false,
	});
	const [loading, setLoading] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const callbackUrl = useSearchParams().get('callbackUrl') || '/';
	const errorMessage = decodeURI(useSearchParams().get('error') || '');
	const successMessage = decodeURI(useSearchParams().get('success') || '');
	const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		signIn('credentials', { email: form.email, password: form.password, redirect: true, callbackUrl: callbackUrl });
	};

	return (
		<div className="flex items-center justify-center w-full md:w-2/4 md:px-4">
			<form onSubmit={handlesubmit} className="flex flex-col items-center md:items-start gap-5 w-full max-w-[500px] py-10 ">
				<h1 className="text-2xl font-bold">Se connecter</h1>
				<Input
					isInvalid={form.is_email_invalid}
					errorMessage="Email invalide"
					autoComplete="email"
					type="text"
					onBlur={() => {
						!form.email.includes('@') || !form.email.includes('.') ? setform((prev) => ({ ...prev, is_email_invalid: true })) : setform((prev) => ({ ...prev, is_email_invalid: false }));
					}}
					name="email"
					placeholder="Email"
					aria-label="Email"
					value={form.email}
					onChange={(e) => setform((prev) => ({ ...prev, email: e.target.value }))}
				/>
				<div className="flex flex-col w-full gap-1">
					<Input
						type={isPasswordVisible ? 'text' : 'password'}
						name="password"
						autoComplete="current-password"
						aria-label="Mot de passe"
						placeholder="Mot de passe"
						errorMessage="Mot de passe invalide"
						value={form.password}
						onChange={(e) => setform((prev) => ({ ...prev, password: e.target.value }))}
						onBlur={() => {
							!form.password.length || form.password.length < 8
								? setform((prev) => ({ ...prev, is_password_invalid: true }))
								: setform((prev) => ({ ...prev, is_password_invalid: false }));
						}}
						endContent={
							isPasswordVisible ? (
								<EyeSlashIcon className="w-6 h-6 cursor-pointer text-bg_light_main_color" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
							) : (
								<EyeIcon className="w-6 h-6 cursor-pointer text-bg_light_main_color" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
							)
						}
						isInvalid={form.is_password_invalid}
					/>
				</div>
				{errorMessage && <p className="text-red-500">{errorMessage}</p>}
				{successMessage && <p className="text-green-500">{successMessage}</p>}
				<Button
					isLoading={loading}
					disabled={form.is_email_invalid === true || form.is_password_invalid === true || !form.email || !form.password}
					className="w-full text-white disabled:opacity-50 disabled:hover:opacity-50 bg-bg_light_main_color/80"
					type="submit"
				>
					Se connecter
				</Button>
			</form>
		</div>
	);
};

export default Page;
