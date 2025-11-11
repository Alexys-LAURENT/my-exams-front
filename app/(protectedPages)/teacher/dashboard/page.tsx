import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { auth } from '@/utils/auth';
import BlockClass from '@/components/teacher/BlockClass';
import { Class, Degree } from '@/types/entitties';
import BlockCreateExam from '@/components/teacher/BlockCreateExam';
import BlockExam from '@/components/teacher/BlockExam';

export type ClassWithDegree = Class & {
	degree: Degree | null;
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const classesResponse = await getAllClassesForOneTeacher(idTeacher, 5);
	if (!('success' in classesResponse)) {
		throw new Error('Erreur lors du chargement des classes');
	}
	const classes = 'success' in classesResponse ? classesResponse.data : [];
	const examsResponse = await getAllExamsForOneTeacher(idTeacher);
	if (!('success' in examsResponse)) {
		throw new Error('Erreur lors du chargement des examens');
	}
	const allExams = 'success' in examsResponse ? examsResponse.data : [];
	const sortedExams = allExams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const recentExams = sortedExams.slice(0, 5);

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
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Professeur</h1>
					<p className="text-gray-600">Gérez vos classes et examens</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<BlockClass classesWithDegrees={classesWithDegrees} />
					<BlockCreateExam />
					<BlockExam recentExams={recentExams} />
				</div>
			</div>
		</div>
	);
};

export default Page;
