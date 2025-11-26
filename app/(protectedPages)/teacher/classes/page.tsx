import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import ClassesWrapper from '@/components/TeacherClassPage/ClassesWrapper';
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

	// Récupérer les détails pour chaque classe
	const classesWithDetails = await Promise.all(
		classes.map(async (classe) => {
			const [degreeResponse, studentsResponse] = await Promise.all([getClassDegree(classe.idClass), getStudentsOfClass(classe.idClass)]);

			if (!('success' in degreeResponse) || !('success' in studentsResponse)) {
				throw new Error('Erreur lors de la récupération des détails de la classe');
			}

			return {
				...classe,
				degree: degreeResponse.data,
				studentsCount: studentsResponse.data.length,
			} as ClassWithDegree;
		})
	);

	return (
		<div className="flex flex-col gap-8 p-6 pb-0">
			{/* Header avec bandeau bleu */}
			<div className="bg-gradient-to-br from-blue-700 to-blue-900  rounded-xl shadow-lg p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h1 className="text-4xl font-bold mb-2">Mes Classes</h1>
						<p className="text-blue-100">Gérez et consultez toutes vos classes</p>
					</div>
					<AcademicCapIcon className="w-16 h-16 opacity-80" />
				</div>
			</div>

			{classes.length === 0 ? (
				<div className="bg-white rounded-xl shadow-lg p-12 text-center">
					<AcademicCapIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
					<h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucune classe</h3>
					<p className="text-gray-500">Vous n&apos;avez pas encore de classes assignées</p>
				</div>
			) : (
				<ClassesWrapper classesWithDetails={classesWithDetails} />
			)}
		</div>
	);
};

export default Page;
