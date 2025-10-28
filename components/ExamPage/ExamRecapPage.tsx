import { getExamRecap } from '@/backend_requests/exams/getExamRecap';
import { ExamClass } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';
import StudentExamRecap from './StudentExamRecap';
import StudentExamRecapUnavailable from './StudentExamRecapUnavailable';
import TeacherExamRecap from './TeacherExamRecap';

interface ExamRecapPageProps {
	idStudent: number;
	idExam: number;
	idClass: number;
	loggedUser: User;
	examClass: ExamClass;
}

const ExamRecapPage = async ({ idStudent, idExam, idClass, loggedUser, examClass }: ExamRecapPageProps) => {
	const recapRes = await getExamRecap(idStudent, idClass, idExam);
	const session = await auth();

	if (!session) {
		redirect('/login');
	}

	if ('error' in recapRes) {
		throw new Error('Error fetching exam recap data');
	}

	const examData = recapRes.data;

	// Si c'est un professeur, afficher la vue professeur avec possibilité de notation
	if (session.user.accountType === 'teacher') {
		if (!('questions' in examData)) {
			// The API will always return questions for teacher view so this is just a safety check
			throw new Error('Exam data is incomplete for teacher view');
		}
		return <TeacherExamRecap examData={examData} idStudent={idStudent} examClass={examClass} />;
	}

	// Si c'est un étudiant
	if (examData.isExamTimeFinished) {
		// L'examen est terminé, l'étudiant peut voir ses réponses et corrections
		return <StudentExamRecap examData={examData} idStudent={idStudent} loggedUser={loggedUser} examClass={examClass} />;
	} else {
		// L'examen n'est pas terminé, afficher la page d'indisponibilité
		return <StudentExamRecapUnavailable examData={examData} examClass={examClass} />;
	}
};

export default ExamRecapPage;
