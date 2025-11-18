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

interface PendingExamsListProps {
	idClass: number;
	idStudent: number;
}

const PendingExamsList = async ({ idClass, idStudent }: PendingExamsListProps) => {
	// Récupérer les examens en attente
	const pendingExamsResponse = await getExamsOfClass(idClass, { status: 'pending', limit: DASHBOARD_LIMITS.PENDING_EXAMS });

	if (!('success' in pendingExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens à faire');
	}

	// Récupérer les examGrade pour chaque examen
	const pendingExamsWithGrades: ExamWithGrade[] = await Promise.all(
		pendingExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClass, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const hasMore = pendingExamsWithGrades.length === DASHBOARD_LIMITS.PENDING_EXAMS;

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<DocumentTextIcon className="w-6 h-6 text-blue-600" />
					<h2 className="text-xl font-bold text-gray-900">Examens à faire</h2>
				</div>
				<span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
					{pendingExamsWithGrades.length} examen{pendingExamsWithGrades.length > 1 ? 's' : ''}
				</span>
			</div>

			{pendingExamsWithGrades.length === 0 ? (
				<div className="bg-white border border-black/10 rounded-xl p-8 text-center">
					<DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">Aucun examen à faire pour le moment</p>
				</div>
			) : (
				<>
					<div className="bg-white border border-black/10 rounded-xl divide-y divide-gray-100">
						{pendingExamsWithGrades.map((exam) => (
							<ToDoExamCard key={exam.idExam} idClass={idClass} exam={exam} idStudent={idStudent} />
						))}
					</div>
					{hasMore && (
						<Link
							href={`/student/${idClass}/exams?status=pending`}
							className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
						>
							Voir tous les examens à faire
						</Link>
					)}
				</>
			)}
		</div>
	);
};

export default PendingExamsList;
