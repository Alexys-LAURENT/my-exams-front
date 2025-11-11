import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { auth } from '@/utils/auth';
import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { DocumentTextIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

// Fonction pour formater le temps
const formatTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0) {
		return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
	}
	return `${mins}min`;
};

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté
	const session = await auth();
	if (!session?.user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Vous devez être connecté pour accéder à cette page</p>
					</div>
				</div>
			</div>
		);
	}

	const idStudent = session.user.idUser;

	// Récupérer les données en parallèle
	const [pendingExamsResponse, completedExamsResponse, commingExamsResponse, degreeResponse] = await Promise.all([
		getExamsOfClass(idClassNumber, { status: 'pending' }),
		getExamsOfClass(idClassNumber, { status: 'completed' }),
		getExamsOfClass(idClassNumber, { status: 'comming' }),
		getClassDegree(idClassNumber),
	]);

	// Vérification des erreurs
	if (!('success' in pendingExamsResponse)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération des examens en cours</p>
					</div>
				</div>
			</div>
		);
	}

	if (!('success' in completedExamsResponse)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération des examens passés</p>
					</div>
				</div>
			</div>
		);
	}

	if (!('success' in commingExamsResponse)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération des examens à venir</p>
					</div>
				</div>
			</div>
		);
	}

	// Récupérer les examGrade pour chaque examen
	const pendingExamsWithGrades: ExamWithGrade[] = await Promise.all(
		pendingExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClassNumber, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const completedExamsWithGrades: ExamWithGrade[] = await Promise.all(
		completedExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClassNumber, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const degreeName = 'success' in degreeResponse ? degreeResponse.data.name : 'Formation';

	// Calcul des statistiques
	const totalPendingExams = pendingExamsWithGrades.length;
	const totalCompletedExams = completedExamsWithGrades.length;

	// Calcul du rang (simulé pour l'instant - à implémenter avec une vraie API)
	const classRank = '5/28'; // TODO: Implémenter la vraie logique

	// Calcul de la moyenne générale
	const gradesWithNote = completedExamsWithGrades.filter((exam) => exam.examGrade?.note !== null);
	const averageGrade =
		gradesWithNote.length > 0 ? gradesWithNote.reduce((acc, exam) => acc + (exam.examGrade?.note || 0), 0) / gradesWithNote.length : 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Bonjour {session.user.name}
					</h1>
					<p className="text-gray-600">Voici un aperçu de vos examens et résultats - {degreeName}</p>
					<p className="text-sm text-gray-500 mt-1">
						Aujourd&apos;hui{' '}
						{new Date().toLocaleDateString('fr-FR', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
					</p>
				</div>

				{/* Examens à faire */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-gray-900">Examens à faire</h2>
						<span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
							{totalPendingExams} examen{totalPendingExams > 1 ? 's' : ''}
						</span>
					</div>

					{pendingExamsWithGrades.length === 0 ? (
						<div className="bg-white rounded-xl shadow-lg p-8 text-center">
							<DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">Aucun examen à faire pour le moment</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pendingExamsWithGrades.map((exam) => (
								<Link
									key={exam.idExam}
									href={`/student/${idClassNumber}/${idStudent}/${exam.idExam}`}
									className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
								>
									{/* Image de l'examen */}
									<div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
										{exam.imagePath ? (
											<img src={exam.imagePath} alt={exam.title} className="w-full h-full object-cover" />
										) : (
											<div className="flex items-center justify-center h-full">
												<DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
											</div>
										)}
									</div>

									<div className="p-6">
										{/* Titre */}
										<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>

										{/* Description */}
										{exam.desc && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.desc}</p>}

										{/* Informations */}
										<div className="space-y-2 mb-4">
											<div className="flex items-center text-sm text-gray-600">
												<ClockIcon className="w-4 h-4 mr-2" />
												<span>Durée : {formatTime(exam.time)}</span>
											</div>
											<div className="text-sm text-gray-600">
												<span className="font-medium">Disponible jusqu&apos;au :</span> {formatDate(exam.end_date)}
											</div>
										</div>

										{/* Statut */}
										<div className="flex items-center justify-between pt-4 border-t border-gray-200">
											{exam.examGrade ? (
												<>
													<span className="text-sm text-gray-600">Statut : {exam.examGrade.status}</span>
													{exam.examGrade.note !== null && (
														<span className="text-lg font-bold text-indigo-600">{exam.examGrade.note}/20</span>
													)}
												</>
											) : (
												<span className="text-sm text-gray-600">Pas encore commencé</span>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Examens à venir */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-gray-900">Examens à venir</h2>
						<span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
							{commingExamsResponse.data.length} examen{commingExamsResponse.data.length > 1 ? 's' : ''}
						</span>
					</div>

					{commingExamsResponse.data.length === 0 ? (
						<div className="bg-white rounded-xl shadow-lg p-8 text-center">
							<CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">Aucun examen à venir</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{commingExamsResponse.data.map((exam) => (
								<div
									key={exam.idExam}
									className="bg-white rounded-xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed"
								>
									{/* Image de l'examen */}
									<div className="h-32 bg-gradient-to-br from-gray-400 to-gray-600 relative">
										{exam.imagePath ? (
											<img src={exam.imagePath} alt={exam.title} className="w-full h-full object-cover grayscale" />
										) : (
											<div className="flex items-center justify-center h-full">
												<DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
											</div>
										)}
										<div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
											Bientôt
										</div>
									</div>

									<div className="p-6">
										{/* Titre */}
										<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>

										{/* Description */}
										{exam.desc && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.desc}</p>}

										{/* Informations */}
										<div className="space-y-2 mb-4">
											<div className="flex items-center text-sm text-gray-600">
												<ClockIcon className="w-4 h-4 mr-2" />
												<span>Durée : {formatTime(exam.time)}</span>
											</div>
											<div className="flex items-center text-sm text-gray-600">
												<CalendarIcon className="w-4 h-4 mr-2" />
												<span className="font-medium">Disponible à partir du :</span>
											</div>
											<div className="text-sm text-indigo-600 font-medium ml-6">{formatDate(exam.start_date)}</div>
										</div>

										{/* Message */}
										<div className="pt-4 border-t border-gray-200">
											<p className="text-sm text-gray-500 italic">Cet examen n&apos;est pas encore disponible</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default page;
