import { getExamsByTypeOfStudentInClass } from '@/backend_requests/exams/getExamsByTypeOfStudentInClass';
import ExamCard from './ExamCard';

interface TodoExamsProps {
	idClassNumber: number;
	idStudent: number;
}

const TodoExams = async ({ idClassNumber, idStudent }: TodoExamsProps) => {
	const todoExamsResponse = await getExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'pending');

	if (!('success' in todoExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens à faire');
	}
	const todoExams = todoExamsResponse.data.toReversed();

	if (todoExams.length === 0) {
		return (
			<div className="w-full bg-white rounded-xl p-4">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Examens à faire</h2>
				<div className="flex items-center gap-4 overflow-x-auto">
					<p className="text-gray-500">Vous n&apos;avez aucun examen à faire pour le moment.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full bg-white rounded-xl p-4">
			<h2 className="text-xl font-bold text-gray-900 mb-4">Examens à faire</h2>
			<div className="flex items-center gap-4 overflow-x-auto">
				{todoExams.map((exam) => (
					<ExamCard exam={exam} idClass={idClassNumber} idStudent={idStudent} key={exam.idExam} />
				))}
			</div>
		</div>
	);
};

export default TodoExams;
