import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import ExamsList from '@/components/StudentExams/ExamsList';
import { ExamGrade, ExamWithDates } from '@/types/entitties';
import { auth } from '@/utils/auth';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	const session = await auth();
	const idStudent = session!.user!.idUser;

	const allExamsResponse = await getExamsOfClass(idClassNumber);

	// Vérification des erreurs
	if (!('success' in allExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens');
	}

	// Récupérer les examGrade pour chaque examen
	const allExamsWithGrades: ExamWithGrade[] = await Promise.all(
		allExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClassNumber, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	// Calculer le status de chaque examen selon les dates
	const now = new Date();
	const pendingExamsWithGrades = allExamsWithGrades.filter((exam) => {
		const endDate = new Date(exam.end_date);
		return endDate >= now; // Examen à faire si la date de fin n'est pas dépassée
	});
	const completedExamsWithGrades = allExamsWithGrades.filter((exam) => {
		const endDate = new Date(exam.end_date);
		return endDate < now; // Examen passé si la date de fin est dépassée
	});

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				<ExamsList pendingExams={pendingExamsWithGrades} completedExams={completedExamsWithGrades} idStudent={idStudent} />
			</div>
		</div>
	);
};

export default page;
