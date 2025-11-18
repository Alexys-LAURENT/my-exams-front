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

	// Récupérer tous les examens de la classe
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

	// Séparer les examens par statut selon les dates
	const now = new Date();
	const pendingExamsWithGrades = allExamsWithGrades.filter((exam) => {
		const startDate = new Date(exam.start_date);
		const endDate = new Date(exam.end_date);
		return startDate <= now && endDate >= now; // Examen en cours
	});

	const completedExamsWithGrades = allExamsWithGrades.filter((exam) => {
		const endDate = new Date(exam.end_date);
		return endDate < now; // Examen terminé
	});

	const upcomingExams = allExamsResponse.data.filter((exam) => {
		const startDate = new Date(exam.start_date);
		return startDate > now; // Examen à venir (pas encore commencé)
	});

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				<ExamsList pendingExams={pendingExamsWithGrades} completedExams={completedExamsWithGrades} upcomingExams={upcomingExams} idStudent={idStudent} idClass={idClassNumber} />
			</div>
		</div>
	);
};

export default page;
