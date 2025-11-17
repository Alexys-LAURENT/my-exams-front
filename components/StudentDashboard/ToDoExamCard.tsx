import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type ToDoExamCardProps = {
	exam: ExamWithGrade;
	idStudent: number;
};

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'short',
	});
};

const ToDoExamCard = ({ exam, idStudent }: ToDoExamCardProps) => {
	return (
		<Link
			href={`/student/${idStudent}/${exam.idExam}`}
			className="bg-white rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
		>
			<div className="flex items-center gap-4 flex-1">
				{/* Icône */}
				<div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
					<DocumentTextIcon className="w-6 h-6 text-blue-600" />
				</div>

				{/* Contenu */}
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
					<p className="text-sm text-gray-600 truncate">{exam.desc || 'Fonctions et dérivées'}</p>
				</div>
			</div>

			{/* Date ou Note */}
			<div className="text-right flex-shrink-0 ml-4">
				{exam.examGrade?.note !== null && exam.examGrade?.note !== undefined ? (
					<>
						<p className="text-lg font-bold text-green-600">{exam.examGrade.note}/20</p>
						<p className="text-xs text-gray-500">{formatDate(exam.end_date)}</p>
					</>
				) : (
					<>
						<p className="text-sm font-medium text-gray-900">{formatDate(exam.end_date)}</p>
						<p className="text-xs text-gray-500">14h00</p>
					</>
				)}
			</div>
		</Link>
	);
};

export default ToDoExamCard;
