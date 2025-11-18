import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getUserAverageInClass } from '@/backend_requests/stats/getUserAverageInClass';
import CompletedExamsList from '@/components/StudentDashboard/CompletedExamsList';
import LatestExamGrades from '@/components/StudentDashboard/LatestExamGrades';
import PendingExamsList from '@/components/StudentDashboard/PendingExamsList';
import UpcomingExamsList from '@/components/StudentDashboard/UpcomingExamsList';
import { auth } from '@/utils/auth';
import Link from 'next/link';

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté (garanti par le middleware)
	const session = await auth();
	const idStudent = session!.user!.idUser;

	// Récupérer les données de base en parallèle
	const [classReponse, degreeResponse, averageResponse] = await Promise.all([getOneClass(idClassNumber), getClassDegree(idClassNumber), getUserAverageInClass(idClassNumber, idStudent)]);

	// Vérification des erreurs - NextJs redirigera vers la page d'erreur par défaut
	if (!('success' in classReponse) || !('success' in degreeResponse) || !('success' in averageResponse)) {
		throw new Error('Erreur lors de la récupération des données du dashboard');
	}
	console.log(averageResponse);

	const degreeName = degreeResponse.data.name;

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8 h-[33svh] bg-linear-to-b from-blue-100 to-blue-200 rounded-md flex flex-col justify-center items-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Bonjour {session!.user.name}</h1>
					<p className="text-gray-600">Voici un aperçu de vos examens et résultats</p>
					<p className="text-gray-600">
						{classReponse.data.name} {degreeName}
					</p>
					{/* Moyenne générale */}
					<p className="text-gray-700 mt-2">
						Votre moyenne générale dans cette classe est de :{' '}
						<span className="font-semibold">{averageResponse.data.average !== null ? averageResponse.data.average.toFixed(2) : 'N/A'}/20</span>
					</p>
				</div>

				<div className="flex flex-col gap-12">
					{/* Dernières notes */}
					<LatestExamGrades idClass={idClassNumber} idStudent={idStudent} />

					{/* Grid avec Examens à faire et Examens passés */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
						{/* Examens à faire */}
						<PendingExamsList idClass={idClassNumber} idStudent={idStudent} />

						{/* Examens passés */}
						<CompletedExamsList idClass={idClassNumber} idStudent={idStudent} />
					</div>

					{/* Examens à venir */}
					<UpcomingExamsList idClass={idClassNumber} />

					<Link
						href={`/student/${idClass}/exams`}
						className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
					>
						Voir tous les examens
					</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
