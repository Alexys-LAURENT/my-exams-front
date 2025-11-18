import { getStudentClasses } from '@/backend_requests/classes/getStudentClasses';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { AcademicCapIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Fonction pour calculer la durée de validité
const calculateDuration = (startDate: string, endDate: string) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffTime = Math.abs(end.getTime() - start.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays < 30) {
		return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months} mois`;
	} else {
		const years = Math.floor(diffDays / 365);
		const remainingMonths = Math.floor((diffDays % 365) / 30);
		return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`;
	}
};

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

// Fonction pour vérifier si la classe est active
const isClassActive = (startDate: string, endDate: string) => {
	const now = new Date();
	const start = new Date(startDate);
	const end = new Date(endDate);
	return now >= start && now <= end;
};

const page = async () => {
	const classes = await getStudentClasses();

	if (!('success' in classes)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération des classes</p>
					</div>
				</div>
			</div>
		);
	}

	// Récupérer toutes les données des diplômes en parallèle
	const classesWithDegrees = await Promise.all(
		classes.data.map(async (classe) => {
			const degree = await getClassDegree(classe.idClass);
			return {
				...classe,
				degree: 'success' in degree ? degree.data : null,
			};
		})
	);

	return (
		<div className="min-h-screen  p-6">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Classes</h1>
					<p className="text-gray-600">Découvrez vos formations et leurs périodes de validité</p>
				</div>

				{classesWithDegrees.length === 0 ? (
					<div className="bg-white rounded-xl shadow-lg p-8 text-center">
						<AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune classe trouvée</h3>
						<p className="text-gray-600">Vous n&apos;êtes inscrit à aucune classe pour le moment.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{classesWithDegrees.map((classe) => {
							const isActive = isClassActive(classe.startDate, classe.endDate);
							const duration = calculateDuration(classe.startDate, classe.endDate);

							return (
								<Link
									href={`/student/${classe.idClass}/dashboard`}
									key={classe.idClass}
									className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
								>
									{/* Header avec statut */}
									<div className={`h-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>

									<div className="p-6">
										{/* Titre du diplôme */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
													{classe.degree ? classe.degree.name : 'Diplôme non disponible'} {classe.name}
												</h3>
												<span
													className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
														isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
													}`}
												>
													{isActive ? 'En cours' : 'Terminée'}
												</span>
											</div>
											<AcademicCapIcon className="w-8 h-8 text-indigo-500 flex-shrink-0 ml-3" />
										</div>

										{/* Informations sur les dates */}
										<div className="space-y-3">
											<div className="flex items-center text-gray-600">
												<CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
												<div className="text-sm">
													<p>Du {formatDate(classe.startDate)}</p>
													<p>Au {formatDate(classe.endDate)}</p>
												</div>
											</div>

											<div className="flex items-center text-gray-600">
												<ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
												<span className="text-sm font-medium">Durée: {duration}</span>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default page;
