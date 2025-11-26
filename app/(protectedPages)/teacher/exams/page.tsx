import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { getOneMatiere } from '@/backend_requests/matieres/getOneMatiere';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import ExamsWrapper from '@/components/TeacherExamPage/ExamsWrapper';
import { Exam } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

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
		<div className="flex flex-col gap-8 p-6 pb-0">
			{/* Header avec bandeau bleu */}
			<div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h1 className="text-4xl font-bold mb-2">Mes Examens</h1>
						<p className="text-blue-100">Gérez et consultez tous vos examens</p>
					</div>
					<DocumentTextIcon className="w-16 h-16 opacity-80" />
				</div>
			</div>

			{exams.length === 0 ? (
				<div className="bg-white rounded-xl p-12 text-center">
					<DocumentTextIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
					<h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucun examen créé</h3>
					<p className="text-gray-500">Vous n&apos;avez pas encore créé d&apos;examens</p>
				</div>
			) : (
				<ExamsWrapper examsWithAdditionalData={examsWithAdditionalData} />
			)}
		</div>
	);
};

export default Page;
