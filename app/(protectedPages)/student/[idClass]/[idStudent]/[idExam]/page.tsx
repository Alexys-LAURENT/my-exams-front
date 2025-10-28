import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { reTakeExam } from '@/backend_requests/exams/reTakeExam';
import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import ExamRecapPage from '@/components/ExamPage/ExamRecapPage';
import ExamTestPage from '@/components/ExamPage/ExamTestPage';
import { ExamClass } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{
		idExam: string;
		idStudent: string;
		idClass: string;
	}>;
}

// Validation de l'accès étudiant
function validateStudentAccess(session: Session | null, idStudent: number) {
	if (!session) {
		redirect('/login');
	}

	if (session.user.accountType === 'student' && session.user.idUser !== idStudent) {
		redirect('/');
	}
}

// Vérification des dates de l'examen
function isExamAvailable(examClass: ExamClass, accountType: string) {
	const now = new Date();
	const startDate = new Date(examClass.start_date);
	const endDate = new Date(examClass.end_date);

	if (accountType === 'student' && now < startDate) {
		return { available: false, reason: 'not_started' };
	}

	if (now > endDate) {
		return { available: false, reason: 'ended' };
	}

	return { available: true };
}

// Gestion de la reprise d'examen
async function handleExamRetake(idStudent: number, idClass: number, idExam: number) {
	const reTakedExam = await reTakeExam(idStudent, idClass, idExam);

	if ('error' in reTakedExam) {
		throw new Error('Error fetching exam data for retake');
	}

	if ('forcedStop' in reTakedExam && reTakedExam.forcedStop) {
		return { canRetake: false };
	}

	const { questions, ...examWithoutQuestions } = reTakedExam.data;
	return {
		canRetake: true,
		exam: examWithoutQuestions,
		questions,
	};
}

const Page = async ({ params }: PageProps) => {
	// Extraction des paramètres
	const { idExam: idExamStr, idStudent: idStudentStr, idClass: idClassStr } = await params;
	const idExam = parseInt(idExamStr, 10);
	const idStudent = parseInt(idStudentStr, 10);
	const idClass = parseInt(idClassStr, 10);

	// Authentification et validation
	const session = await auth();
	validateStudentAccess(session, idStudent);

	// Récupération de la relation examen-classe
	const examClassRelation = await getExamClass(idExam, idClass);
	if ('error' in examClassRelation) {
		redirect('/');
	}

	const { data: examClass } = examClassRelation;
	const { user } = session!;

	// Cas 1: Vue enseignant
	if (user.accountType === 'teacher') {
		return <ExamRecapPage idClass={idClass} idStudent={idStudent} idExam={idExam} loggedUser={user} examClass={examClass} />;
	}

	// Cas 2: Vérification de disponibilité de l'examen
	const examAvailability = isExamAvailable(examClass, user.accountType);

	if (!examAvailability.available) {
		if (examAvailability.reason === 'not_started') {
			redirect('/');
		}

		// Examen terminé
		return <ExamRecapPage idExam={idExam} idStudent={idStudent} idClass={idClass} loggedUser={user} examClass={examClass} />;
	}

	// Cas 3: Examen en cours - vérifier si l'étudiant a déjà une note
	const existingExamGrade = await getExamGradeOneStudent(idStudent, idClass, idExam);

	// Cas 3a: Pas encore de note - commencer l'examen
	if ('error' in existingExamGrade) {
		if ('exists' in existingExamGrade && existingExamGrade.exists === false) {
			return <ExamTestPage idExam={idExam} idClass={idClass} examClass={examClass} />;
		}
		throw new Error('Error fetching exam grade data');
	}

	// Cas 3b: Note existante
	const { data: examGrade } = existingExamGrade;

	if (examGrade.status === 'en cours') {
		// Reprendre l'examen
		const retakeResult = await handleExamRetake(idStudent, idClass, idExam);

		if (!retakeResult.canRetake) {
			return <ExamRecapPage idExam={idExam} idStudent={idStudent} idClass={idClass} loggedUser={user} examClass={examClass} />;
		}

		return (
			<ExamTestPage
				idExam={idExam}
				idClass={idClass}
				preLoadedExam={retakeResult.exam}
				preLoadedQuestionsWithAnswersAndUserResponse={retakeResult.questions}
				forceExamStarted
				examClass={examClass}
			/>
		);
	}

	// Cas 3c: Examen déjà terminé
	return <ExamRecapPage idExam={idExam} idStudent={idStudent} idClass={idClass} loggedUser={user} examClass={examClass} />;
};

export default Page;
