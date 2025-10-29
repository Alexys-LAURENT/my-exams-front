import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import { auth } from '@/utils/auth';
import { AcademicCapIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const classesResponse = await getAllClassesForOneTeacher(idTeacher);
	const classes = 'success' in classesResponse ? classesResponse.data : [];
	const sortedClasses = classes.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
	const classesWithDetails = await Promise.all(
		sortedClasses.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);
			const studentsResponse = await getStudentsOfClass(classe.idClass);
			return {
				...classe,
				degree: 'success' in degreeResponse ? degreeResponse.data : null,
				studentsCount: 'success' in studentsResponse ? studentsResponse.data.length : 0,
			};
		})
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Classes</h1>
					<p className="text-gray-600">Gérez et consultez toutes vos classes</p>
				</div>
				{classesWithDetails.length === 0 ? (
					<div className="bg-white rounded-xl shadow-lg p-12 text-center">
						<AcademicCapIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucune classe</h3>
					</div>
				) : (
					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
							<div className="flex items-center justify-between text-white">
								<div>
									<h2 className="text-2xl font-bold mb-1">Liste des classes</h2>
									<p className="text-indigo-100 text-sm">
										{classesWithDetails.length} classe{classesWithDetails.length !== 1 ? 's' : ''}
									</p>
								</div>
								<AcademicCapIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="p-6">
							<div className="space-y-3">
								{classesWithDetails.map((classe) => (
									<Link
										key={classe.idClass}
										href={`/teacher/classes/${classe.idClass}`}
										className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 px-6 py-4 rounded-lg border border-gray-200 hover:border-indigo-300 group"
									>
										<div className="flex items-center justify-between gap-4">
											<div className="flex-1 min-w-0">
												<div className="mb-2">
													<h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
														{classe.degree ? classe.degree.name : `Classe ${classe.idClass}`}
													</h3>
												</div>

												<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
													<div className="flex items-center gap-1">
														<CalendarIcon className="w-4 h-4 text-indigo-500" />
														<span>Du {formatDate(classe.startDate)}</span>
													</div>
													<div className="flex items-center gap-1">
														<CalendarIcon className="w-4 h-4 text-indigo-500" />
														<span>Au {formatDate(classe.endDate)}</span>
													</div>
													<div className="flex items-center gap-1">
														<UsersIcon className="w-4 h-4 text-indigo-500" />
														<span>
															{classe.studentsCount} étudiant{classe.studentsCount !== 1 ? 's' : ''}
														</span>
													</div>
												</div>
											</div>

											<div className="flex-shrink-0">
												<span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">Voir détails →</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
