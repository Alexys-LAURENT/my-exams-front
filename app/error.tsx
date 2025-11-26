'use client';

import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
	const router = useRouter();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen  flex items-center justify-center p-6">
			<div className=" w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="flex flex-col items-center text-center">
					{/* Icon */}
					<div className="relative mb-6">
						<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
							<ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
						</div>
						<div className="absolute inset-0 w-24 h-24 bg-red-200 rounded-full animate-ping opacity-20"></div>
					</div>

					{/* Title */}
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Oups !</h1>

					{/* Message */}
					<p className="text-xl text-gray-700 mb-2">Une erreur inattendue s&apos;est produite</p>
					<p className="text-gray-500 mb-8">
						Nous sommes désolés, quelque chose s&apos;est mal passé lors du chargement de cette page. Nos équipes ont été notifiées et travaillent à résoudre le problème.
					</p>

					{/* Error details (optional, for dev) */}
					{process.env.NODE_ENV === 'development' && (
						<div className="w-full bg-gray-100 rounded-lg p-4 mb-6 text-left">
							<p className="text-sm text-gray-600 font-mono break-all">{error.message}</p>
						</div>
					)}

					{/* Action buttons */}
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<Button size="lg" color="primary" className="font-semibold" startContent={<HomeIcon className="w-5 h-5" />} onPress={() => router.push('/')}>
							Retour à l&apos;accueil
						</Button>
						<Button size="lg" variant="bordered" className="font-semibold" onPress={() => reset()}>
							Réessayer
						</Button>
					</div>

					{/* Help text */}
					<p className="text-sm text-gray-400 mt-8">Si le problème persiste, contactez votre administrateur ou rafraîchissez la page.</p>
				</div>
			</div>
		</div>
	);
};

export default Error;
