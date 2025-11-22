import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getActiveAndUpcomingExamsForTeacher } from '@/backend_requests/exams/getActiveAndUpcomingExamsForTeacher';
import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import BlockActiveExams from '@/components/teacher/BlockActiveExams';
import BlockClass from '@/components/teacher/BlockClass';
import BlockCreateExam from '@/components/teacher/BlockCreateExam';
import BlockExam from '@/components/teacher/BlockExam';
import { Class, Exam, ExamClass } from '@/types/entitties';
import { auth } from '@/utils/auth';

export type ExamWithExtendedClassDates = Exam & {
	examClasses: (ExamClass & { classe: Class })[];
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const classesResponse = await getAllClassesForOneTeacher(idTeacher, 5);
	if (!('success' in classesResponse)) {
		throw new Error('Erreur lors du chargement des classes');
	}
	const classes = classesResponse.data;
	const examsResponse = await getAllExamsForOneTeacher(idTeacher);
	if (!('success' in examsResponse)) {
		throw new Error('Erreur lors du chargement des examens');
	}
	const allExams = examsResponse.data;
	const sortedExams = allExams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const recentExams = sortedExams.slice(0, 5);

	// Récupérer les examens actifs et à venir
	const activeExamsResponse = await getActiveAndUpcomingExamsForTeacher(idTeacher, 5);
	const activeExams = 'success' in activeExamsResponse && activeExamsResponse.success ? activeExamsResponse.data : [];

	// Créer les examens actifs avec détails
	const activeExamIds = [...new Set(activeExams.map((a) => a.idExam))];
	const activeExamsWithDetails = (await Promise.all(
		activeExamIds
			.map(async (idExam) => {
				const exam = allExams.find((e) => e.idExam === idExam);
				if (!exam) return null;
				const examClassesRaw = activeExams.filter((a) => a.idExam === idExam);
				const examClasses = await Promise.all(
					examClassesRaw.map(async (ec) => {
						const classe = await getOneClass(ec.idClass);
						if (!('success' in classe)) return ec; // fallback
						return { ...ec, classe: classe.data };
					})
				);
				return { ...exam, examClasses };
			})
			.filter(Boolean)
	)) as ExamWithExtendedClassDates[];

	console.log('activeExams', activeExams);

	const recentExamsWithClasses = await Promise.all(
		recentExams.map(async (exam) => {
			const activeExamsForThisExam = activeExams.filter((a) => a.idExam === exam.idExam);
			const activeExamsExtended = await Promise.all(
				activeExamsForThisExam.map(async (ec) => {
					const classe = await getOneClass(ec.idClass);
					if (!('success' in classe)) {
						throw new Error('Erreur lors de la récupération de la classe');
					}
					return {
						...ec,
						classe: classe.data,
					};
				})
			);
			return {
				...exam,
				activeExamsExtended: [activeExamsExtended],
			};
		})
	);

	console.log('activeExams', activeExams);
	console.log('recentExamsWithClasses', recentExamsWithClasses);

	const classesWithDegrees = await Promise.all(
		classes.map(async (classe) => {
			const degree = await getClassDegree(classe.idClass);

			if (!('success' in degree)) {
				throw new Error('Erreur lors de la récupération des degrees');
			}

			return {
				...classe,
				degree: degree.data,
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
				<div className="mt-6">
					<BlockActiveExams activeExams={activeExamsWithDetails} />
				</div>
			</div>
		</div>
	);
};

export default Page;
