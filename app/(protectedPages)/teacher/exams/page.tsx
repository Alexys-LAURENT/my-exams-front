import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { getOneMatiere } from '@/backend_requests/matieres/getOneMatiere';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import FilterComp from '@/components/TeacherExamPage/FilterComp';
import { Exam } from '@/types/entitties';
import { auth } from '@/utils/auth';

export type ExamWithAdditionalData = Exam & {
	questionsCount: number;
	matiere: {
		idMatiere: number;
		nom: string;
	};
};

const Page = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;
	const examsResponse = await getAllExamsForOneTeacher(idTeacher);
	if (examsResponse && !('success' in examsResponse)) {
		throw new Error('Erreur lors des la récupération des examens');
	}
	const exams = examsResponse.data;
	const sortedExams = exams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	const examsWithAdditionalData = await Promise.all(
		sortedExams.map(async (exam) => {
			const questionsCountResponse = await getQuestionsCountForOneExam(exam.idExam);
			const matiere = await getOneMatiere(exam.idMatiere);
			if (questionsCountResponse && !('success' in questionsCountResponse)) {
				throw new Error('Erreur lors de la récupération du nombre de questions');
			}
			if (!('success' in matiere)) {
				throw new Error('Erreur lors de la récupération de la matière');
			}
			const questionsCount = questionsCountResponse.data;
			return {
				...exam,
				matiere: matiere.data,
				questionsCount: Number(questionsCount),
			};
		})
	);

	return (
		<div className="min-h-screen from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Examens</h1>
					<p className="text-gray-600">Gérez et consultez tous vos examens</p>
				</div>
				<FilterComp examsWithAdditionalData={examsWithAdditionalData} />
			</div>
		</div>
	);
};

export default Page;
