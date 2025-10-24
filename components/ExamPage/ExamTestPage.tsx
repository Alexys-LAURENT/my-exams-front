import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import { Exam, QuestionWithAnswersAndUserReponse } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import ExamTest from './ExamTest';

interface ExamTestPageProps {
	idExam: number;
	preLoadedExam?: Exam;
	preLoadedQuestionsWithAnswersAndUserResponse?: QuestionWithAnswersAndUserReponse[];
	forceExamStarted?: boolean;
}

const ExamTestPage = async ({ idExam, preLoadedExam, preLoadedQuestionsWithAnswersAndUserResponse, forceExamStarted = false }: ExamTestPageProps) => {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}

	let exam: Exam;
	let totalQuestions: number;
	if (preLoadedExam) {
		console.log('Using preloaded exam data');

		exam = preLoadedExam;
		totalQuestions = preLoadedQuestionsWithAnswersAndUserResponse!.length;
	} else {
		const resGetOneExam = await getOneExam(idExam);

		// Redirect if exam not found (user not assigned to this exam or exam doesn't exist)
		if ('error' in resGetOneExam) {
			redirect('/');
		}
		exam = resGetOneExam.data;
		const resTotalQuestions = await getQuestionsCountForOneExam(idExam);

		if ('error' in resTotalQuestions) {
			throw new Error('Error fetching questions count');
		}

		totalQuestions = Number.parseInt(resTotalQuestions.data);
	}

	return (
		<ExamTest
			exam={exam}
			questionsCount={totalQuestions}
			idUser={session.user.idUser}
			preLoadedQuestionsWithAnswersAndUserResponse={preLoadedQuestionsWithAnswersAndUserResponse}
			forceExamStarted={forceExamStarted}
		/>
	);
};

export default ExamTestPage;
