import { getExamRecap } from '@/backend_requests/exams/getExamRecap';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import StudentExamRecap from './StudentExamRecap';
import StudentExamRecapUnavailable from './StudentExamRecapUnavailable';
import TeacherExamRecap from './TeacherExamRecap';

interface ExamRecapPageProps {
	idStudent: number;
	idExam: number;
	idClass: number;
}

const ExamRecapPage = async ({ idStudent, idExam, idClass }: ExamRecapPageProps) => {
	const recapRes = await getExamRecap(idStudent, idClass, idExam);
	const session = await auth();

	if (!session) {
		redirect('/login');
	}

	if ('error' in recapRes) {
		throw new Error('Error fetching exam recap data');
	}

	// These checks should not be necessary due to API protections, but added as a safety net
	if (session.user.accountType === 'teacher' && recapRes.data.idTeacher !== session.user.idUser) {
		redirect('/teacher/dashboard');
	}

	if (session.user.accountType === 'student' && recapRes.data.examGrade.idUser !== session.user.idUser) {
		redirect('/student/classes');
	}

	const examData = recapRes.data;

	// Si c'est un professeur, afficher la vue professeur avec possibilité de notation
	if (session.user.accountType === 'teacher') {
		if (!('questions' in examData)) {
			// The API will always return questions for teacher view so this is just a safety check
			throw new Error('Exam data is incomplete for teacher view');
		}
		return <TeacherExamRecap examData={examData} idStudent={idStudent} />;
	}

	// Si c'est un étudiant
	if (examData.isExamTimeFinished) {
		// L'examen est terminé, l'étudiant peut voir ses réponses et corrections
		return <StudentExamRecap examData={examData} idStudent={idStudent} />;
	} else {
		// L'examen n'est pas terminé, afficher la page d'indisponibilité
		return <StudentExamRecapUnavailable examData={examData} idStudent={idStudent} />;
	}
};

export default ExamRecapPage;
