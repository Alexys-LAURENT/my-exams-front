import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { DASHBOARD_LIMITS } from '@/constants/dashboardLimits';
import { ExamGrade, ExamWithDates } from '@/types/entitties';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ToDoExamCard from './ToDoExamCard';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

interface CompletedExamsListProps {
	idClass: number;
	idStudent: number;
}

const CompletedExamsList = async ({ idClass, idStudent }: CompletedExamsListProps) => {
	// Récupérer les examens terminés
	const completedExamsResponse = await getExamsOfClass(idClass, { status: 'completed', limit: DASHBOARD_LIMITS.COMPLETED_EXAMS });

	if (!('success' in completedExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens passés');
	}

	// Récupérer les examGrade pour chaque examen
	const completedExamsWithGrades: ExamWithGrade[] = await Promise.all(
		completedExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClass, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const hasMore = completedExamsWithGrades.length === DASHBOARD_LIMITS.COMPLETED_EXAMS;

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<DocumentTextIcon className="w-6 h-6 text-green-600" />
					<h2 className="text-xl font-bold text-gray-900">Examens passés</h2>
				</div>
				<span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
					{completedExamsWithGrades.length} examen{completedExamsWithGrades.length > 1 ? 's' : ''}
				</span>
			</div>

			{completedExamsWithGrades.length === 0 ? (
				<div className="bg-white rounded-xl border border-black/10 p-8 text-center">
					<DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">Aucun examen passé pour le moment</p>
				</div>
			) : (
				<>
					<div className="bg-white rounded-xl border border-black/10 divide-y divide-gray-100">
						{completedExamsWithGrades.map((exam) => (
							<ToDoExamCard key={exam.idExam} idClass={idClass} exam={exam} idStudent={idStudent} />
						))}
					</div>
					{hasMore && (
						<Link
							href={`/student/${idClass}/exams?status=completed`}
							className="mt-4 block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
						>
							Voir tous les examens passés
						</Link>
					)}
				</>
			)}
		</div>
	);
};

export default CompletedExamsList;
