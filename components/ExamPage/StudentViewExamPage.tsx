import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { reTakeExam } from '@/backend_requests/exams/reTakeExam';
import ExamRecapPage from './ExamRecapPage';
import ExamTestPage from './ExamTestPage';

interface StudentViewExamPageProps {
	idExam: number;
	idStudent: number;
}

const StudentViewExamPage = async ({ idStudent, idExam }: StudentViewExamPageProps) => {
	const existingExamGrade = await getExamGradeOneStudent(idStudent, idExam);

	if ('error' in existingExamGrade) {
		if ('exists' in existingExamGrade && existingExamGrade.exists === false) {
			return <ExamTestPage idExam={idExam} />;
		}
		throw new Error('Error fetching exam grade data');
	} else {
		if (existingExamGrade.data.status === 'en cours') {
			const reTakedExam = await reTakeExam(idExam);
			if ('error' in reTakedExam) {
				throw new Error('Error fetching exam data for retake');
			}

			const { questions, ...examWithoutQuestions } = reTakedExam.data;
			return <ExamTestPage idExam={idExam} preLoadedExam={examWithoutQuestions} preLoadedQuestionsWithAnswersAndUserResponse={questions} forceExamStarted />;
		} else {
			return <ExamRecapPage idExam={idExam} idStudent={idStudent} isEditable={false} />;
		}
	}
};

export default StudentViewExamPage;
