import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getCountExamsByTypeOfStudentInClass } from '@/backend_requests/exams/getCountExamsByTypeOfStudentInClass';
import { getUserGeneralAverageInClass } from '@/backend_requests/stats/getUserGeneralAverageInClass';
import LatestPassedExams from '@/components/StudentDashboard/LatestPassedExams';
import TodoExams from '@/components/StudentDashboard/TodoExams';
import BannerImage from '@/public/banner.png';
import { auth } from '@/utils/auth';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import Link from 'next/link';

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté (garanti par le middleware)
	const session = await auth();
	const idStudent = session!.user!.idUser;

	// Récupérer les données de base en parallèle
	const [classReponse, degreeResponse, averageResponse, todoExamsResponse, passedExamsResponse, commingExamsResponse] = await Promise.all([
		getOneClass(idClassNumber),
		getClassDegree(idClassNumber),
		getUserGeneralAverageInClass(idClassNumber, idStudent),
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'pending'),
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'completed'),
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'comming'),
	]);

	// Vérification des erreurs - NextJs redirigera vers la page d'erreur par défaut
	if (
		!('success' in classReponse) ||
		!('success' in degreeResponse) ||
		!('success' in averageResponse) ||
		!('success' in todoExamsResponse) ||
		!('success' in passedExamsResponse) ||
		!('success' in commingExamsResponse)
	) {
		throw new Error('Erreur lors de la récupération des données du dashboard');
	}

	const degreeName = degreeResponse.data.name;

	return (
		<div className="flex flex-col gap-8 p-6 pb-0">
			{/* Bento Box Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 lg:grid-rows-[140px_auto]">
				{/* Carte de profil avec bannière */}
				<div
					className="rounded-xl overflow-hidden flex justify-between items-center p-6 shadow-lg"
					style={{
						backgroundImage: `url(${BannerImage.src})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				>
					<div className="flex items-center gap-4">
						<Avatar src={session!.user.avatarPath || ''} name={session!.user.name} size="lg" className="ring-2 ring-white" />
						<div className="flex flex-col">
							<h1 className="text-2xl font-bold text-white">
								{session!.user.name} {session!.user.lastName}
							</h1>
							<p className="text-white/90 text-sm">
								{classReponse.data.name} • {degreeName}
							</p>
						</div>
					</div>
					<Link href={`/profile/${session!.user.idUser}`}>
						<Button variant="bordered" className="rounded-lg border-white border-2 text-white hover:bg-white/20">
							Voir le profil
						</Button>
					</Link>
				</div>{' '}
				{/* Grande carte Moyenne Générale à droite - prend 2 lignes */}
				<Link
					href={`/student/${idClass}/${idStudent}/grades-summary`}
					className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center text-white lg:row-span-2"
				>
					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2 opacity-90">Moyenne Générale</h2>
						<div className="my-6">
							<p className="text-7xl font-bold mb-2">{averageResponse.data.average !== null ? averageResponse.data.average.toFixed(2) : 'N/A'}</p>
							<p className="text-3xl font-light opacity-90">/20</p>
						</div>
						<div className="mt-6 pt-4 border-t border-white/20">
							<p className="text-sm opacity-80">{classReponse.data.name}</p>
							<p className="text-xs opacity-70 mt-1">{degreeName}</p>
						</div>
					</div>
				</Link>
				{/* Trois petites cartes statistiques */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link href={`/student/${idClass}/exams?status=pending`} className="bg-white hover:bg-slate-50 rounded-xl p-4 ">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
								<DocumentTextIcon className="text-purple-600 w-5 h-5" />
							</div>
							<div>
								<p className="text-2xl font-bold text-gray-800">{todoExamsResponse.data.count}</p>
							</div>
						</div>
						<h3 className="font-semibold text-gray-800 text-sm mb-1">Examens à faire</h3>
						<p className="text-xs text-gray-600">Le nombre d&apos;examens que vous devez faire</p>
						<p className="text-xs text-gray-600">Cliquez pour avoir les détails</p>
					</Link>

					<Link href={`/student/${idClass}/exams?status=completed`} className="bg-white hover:bg-slate-50 rounded-xl p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
								<DocumentTextIcon className="text-green-600 w-5 h-5" />
							</div>
							<div>
								<p className="text-2xl font-bold text-gray-800">{passedExamsResponse.data.count}</p>
							</div>
						</div>
						<h3 className="font-semibold text-gray-800 text-sm mb-1">Examens terminés</h3>
						<p className="text-xs text-gray-600">Le nombre d&apos;examens que vous avez fais et/ou qui ont expirés</p>
						<p className="text-xs text-gray-600">Cliquez pour avoir les détails</p>
					</Link>

					<Link href={`/student/${idClass}/exams?status=comming`} className="bg-white hover:bg-slate-50 rounded-xl p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
								<DocumentTextIcon className="text-blue-600 w-5 h-5" />
							</div>
							<div>
								<p className="text-2xl font-bold text-gray-800">{commingExamsResponse.data.count}</p>
							</div>
						</div>
						<h3 className="font-semibold text-gray-800 text-sm mb-1">Examens à venir</h3>
						<p className="text-xs text-gray-600">Le nombre d&apos;examens prévus prochainement</p>
						<p className="text-xs text-gray-600">Cliquez pour avoir les détails</p>
					</Link>
				</div>
			</div>

			<TodoExams idClassNumber={idClassNumber} idStudent={idStudent} />
			<LatestPassedExams idClass={idClassNumber} idStudent={idStudent} />
		</div>
	);
};

export default page;
