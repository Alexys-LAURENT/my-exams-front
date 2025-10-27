import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { reTakeExam } from '@/backend_requests/exams/reTakeExam';
import ExamRecapPage from './ExamRecapPage';
import ExamTestPage from './ExamTestPage';
interface StudentViewExamPageProps {
	idExam: number;
	idStudent: number;
	idClass: number;
}

const StudentViewExamPage = async ({ idStudent, idExam, idClass }: StudentViewExamPageProps) => {
	const existingExamGrade = await getExamGradeOneStudent(idStudent, idClass, idExam);

	if ('error' in existingExamGrade) {
		if ('exists' in existingExamGrade && existingExamGrade.exists === false) {
			return <ExamTestPage idExam={idExam} idClass={idClass} />;
		}
		throw new Error('Error fetching exam grade data');
	} else {
		if (existingExamGrade.data.status === 'en cours') {
			const reTakedExam = await reTakeExam(idStudent, idClass, idExam);

			if ('error' in reTakedExam) {
				throw new Error('Error fetching exam data for retake');
			}

			if ('forcedStop' in reTakedExam && reTakedExam.forcedStop) {
				return <ExamRecapPage idExam={idExam} idStudent={idStudent} idClass={idClass} />;
			}

			const { questions, ...examWithoutQuestions } = reTakedExam.data;
			return <ExamTestPage idExam={idExam} idClass={idClass} preLoadedExam={examWithoutQuestions} preLoadedQuestionsWithAnswersAndUserResponse={questions} forceExamStarted />;
		} else {
			return <ExamRecapPage idExam={idExam} idStudent={idStudent} idClass={idClass} />;
		}
	}
};

export default StudentViewExamPage;
