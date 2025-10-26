import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { auth } from '@/utils/auth';
import { AcademicCapIcon, DocumentTextIcon, PlusCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const classesResponse = await getAllClassesForOneTeacher(idTeacher, 5);
	const classes = 'success' in classesResponse ? classesResponse.data : [];
	const examsResponse = await getAllExamsForOneTeacher(idTeacher);
	const allExams = 'success' in examsResponse ? examsResponse.data : [];
	const recentExams = allExams.slice(0, 5);
	const classesWithDegrees = await Promise.all(
		classes.map(async (classe) => {
			const degree = await getClassDegree(classe.idClass);
			return {
				...classe,
				degree: 'success' in degree ? degree.data : null,
			};
		})
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Professeur</h1>
					<p className="text-gray-600">Gérez vos classes et examens</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
							<div className="flex items-center justify-between text-white">
								<div>
									<h2 className="text-2xl font-bold mb-1">Mes Classes</h2>
									<p className="text-indigo-100 text-sm">Les 5 dernières classes</p>
								</div>
								<AcademicCapIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="flex-1 p-6">
							{classesWithDegrees.length === 0 ? (
								<div className="text-center py-8">
									<AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">Aucune classe</p>
								</div>
							) : (
								<div className="space-y-3">
									{classesWithDegrees.map((classe, index) => (
										<Link
											key={classe.idClass}
											href={`/teacher/classes/${classe.idClass}`}
											className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 group"
										>
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<p className="text-gray-900 font-medium group-hover:text-indigo-700 transition-colors">
														{classe.degree ? classe.degree.name : `Classe ${index + 1}`}
													</p>
													<p className="text-xs text-gray-500 mt-1">Jusqu&apos;au {formatDate(classe.endDate)}</p>
												</div>
												<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
						<div className="p-6 pt-0">
							<Link
								href="/teacher/classes"
								className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center shadow-md hover:shadow-lg"
							>
								Voir toutes les classes
							</Link>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
						<div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
							<div className="flex items-center justify-between text-white">
								<div>
									<h2 className="text-2xl font-bold mb-1">Nouvel Examen</h2>
									<p className="text-green-100 text-sm">Créez un examen</p>
								</div>
								<PlusCircleIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="flex-1 flex flex-col items-center justify-center p-6">
							<div className="text-center mb-6">
								<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
									<DocumentTextIcon className="w-10 h-10 text-green-600" />
								</div>
								<p className="text-gray-600">Créez un nouvel examen pour vos étudiants</p>
							</div>
							<Link
								href="/teacher/exam/create"
								className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-md hover:shadow-lg transform hover:scale-105"
							>
								<PlusCircleIcon className="w-6 h-6 mr-2" />
								Créer un examen
							</Link>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
						<div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
							<div className="flex items-center justify-between text-white">
								<div>
									<h2 className="text-2xl font-bold mb-1">Mes Examens</h2>
									<p className="text-amber-100 text-sm">Les 5 derniers examens</p>
								</div>
								<DocumentTextIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="flex-1 p-6">
							{recentExams.length === 0 ? (
								<div className="text-center py-8">
									<DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">Aucun examen</p>
								</div>
							) : (
								<div className="space-y-3">
									{recentExams.map((exam) => (
										<Link
											key={exam.idExam}
											href={`/teacher/exams/${exam.idExam}`}
											className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-amber-300 group"
										>
											<div className="flex items-center justify-between">
												<div className="flex-1 min-w-0">
													<p className="text-gray-900 font-medium group-hover:text-amber-700 transition-colors truncate">{exam.title}</p>
													<p className="text-xs text-gray-500 mt-1">Créé le {formatDate(exam.createdAt)}</p>
												</div>
												<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
						<div className="p-6 pt-0">
							<Link
								href="/teacher/exams"
								className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center shadow-md hover:shadow-lg"
							>
								Voir tous les examens
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
