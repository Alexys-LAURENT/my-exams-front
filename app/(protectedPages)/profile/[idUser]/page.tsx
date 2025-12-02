import { UpdatePasswordForm } from '@/components/ProfilePage/UpdatePasswordForm';
import { auth } from '@/utils/auth';
import { Avatar } from '@heroui/avatar';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{
		idUser: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const { idUser } = await params;
	const session = await auth();

	if (!session || session.user.idUser.toString() !== idUser) {
		redirect('/');
	}

	const user = session.user;

	// Fonction pour afficher le type de compte en français
	const getAccountTypeLabel = (accountType: string) => {
		switch (accountType) {
			case 'student':
				return 'Étudiant';
			case 'teacher':
				return 'Professeur';
			case 'admin':
				return 'Administrateur';
			default:
				return accountType;
		}
	};

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
				<p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Carte d'informations personnelles */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg border border-gray-200">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
						</div>
						<div className="px-6 py-6">
							<div className="flex flex-col gap-6">
								{/* Avatar et nom */}
								<div className="flex items-center gap-4">
									<Avatar src={user.avatarPath || undefined} name={user.name} size="lg" className="shrink-0" />
									<div className="flex flex-col">
										<p className="text-2xl font-bold text-gray-900">
											{user.name} {user.lastName}
										</p>
										<p className="text-sm text-gray-500">{getAccountTypeLabel(user.accountType)}</p>
									</div>
								</div>

								<div className="border-t border-gray-200"></div>

								{/* Détails de l'utilisateur */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<p className="text-sm font-semibold text-gray-600">Prénom</p>
										<p className="text-base text-gray-900">{user.name}</p>
									</div>

									<div className="flex flex-col gap-1">
										<p className="text-sm font-semibold text-gray-600">Nom</p>
										<p className="text-base text-gray-900">{user.lastName}</p>
									</div>

									<div className="flex flex-col gap-1">
										<p className="text-sm font-semibold text-gray-600">Email</p>
										<p className="text-base text-gray-900">{user.email}</p>
									</div>

									<div className="flex flex-col gap-1">
										<p className="text-sm font-semibold text-gray-600">Type de compte</p>
										<p className="text-base text-gray-900">{getAccountTypeLabel(user.accountType)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Carte de changement de mot de passe */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg border border-gray-200">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
						</div>
						<div className="px-6 py-6">
							<div className="flex flex-col gap-4">
								<p className="text-sm text-gray-600">Modifiez votre mot de passe pour sécuriser votre compte</p>
								<UpdatePasswordForm />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
