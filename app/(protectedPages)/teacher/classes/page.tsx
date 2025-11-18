import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import FilterByDeegree from '@/components/TeacherClassPage/FilterByDeegree';
import { Class, Degree } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export type ClassWithDegree = Class & {
	degree: Degree;
	studentsCount: number;
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const classesResponse = await getAllClassesForOneTeacher(idTeacher);
	if (!('success' in classesResponse)) {
		throw new Error('Erreur lors du chargement des classes');
	}
	const classes = classesResponse.data;
	// sort classes by endDate descending
	const sortedClasses = classes.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
	const classesWithDetails = await Promise.all(
		sortedClasses.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);
			const studentsResponse = await getStudentsOfClass(classe.idClass);

			if (!('success' in degreeResponse) || !('success' in studentsResponse)) {
				throw new Error('Erreur lors de la récupération des détails de la classe');
			}

			return {
				...classe,
				degree: degreeResponse.data,
				studentsCount: studentsResponse.data.length,
			};
		})
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Classes</h1>
					<p className="text-gray-600">Gérez et consultez toutes vos classes</p>
				</div>
				{classes.length === 0 ? (
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
										{classes.length} classe{classes.length !== 1 ? 's' : ''}
									</p>
								</div>
								<AcademicCapIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="p-6">
							<FilterByDeegree classesWithDetails={classesWithDetails} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
