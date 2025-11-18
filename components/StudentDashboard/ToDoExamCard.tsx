import { ExamGrade, ExamWithDates } from '@/types/entitties';
import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type ToDoExamCardProps = {
	idClass: number;
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

const ToDoExamCard = ({ idClass, exam, idStudent }: ToDoExamCardProps) => {
	// Vérifier si l'examen a été réalisé
	const isCompleted = exam.examGrade !== null;
	const hasNote = isCompleted && exam.examGrade?.note !== null && exam.examGrade?.note !== undefined;

	return (
		<Link href={`/student/${idClass}/${idStudent}/${exam.idExam}`} className="bg-white p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200">
			{/* Icône */}
			<div className={`${!isCompleted ? 'bg-orange-100' : 'bg-blue-100'} p-3 rounded-lg flex-shrink-0`}>
				{!isCompleted ? <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" /> : <DocumentTextIcon className="w-6 h-6 text-blue-600" />}
			</div>

			{/* Contenu - avec min-width à 0 pour permettre l'ellipsis */}
			<div className="flex-1 min-w-0 overflow-hidden">
				<h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
				<p className="text-sm text-gray-600 truncate">{exam.desc || ''}</p>
				<p className="text-xs text-gray-500 whitespace-nowrap">
					Valable du {formatDate(exam.start_date)} au {formatDate(exam.end_date)}
				</p>
			</div>

			{/* Date, Note ou Statut - largeur fixe pour éviter l'overflow */}
			<div className="text-right flex-shrink-0 w-24">
				{!isCompleted ? (
					<>
						<p className="text-sm font-semibold text-orange-600 whitespace-nowrap">Non rendu</p>
					</>
				) : hasNote ? (
					<>
						<p className="text-lg font-bold text-green-600 whitespace-nowrap">{exam.examGrade!.note}/20</p>
						<p className="text-xs text-gray-500 whitespace-nowrap">Réaliser le {formatDate(exam.examGrade!.createdAt)}</p>
					</>
				) : (
					<>
						<p className="text-sm font-medium text-blue-600 whitespace-nowrap">En attente</p>
						<p className="text-xs text-gray-500 whitespace-nowrap">Réaliser le {formatDate(exam.examGrade!.createdAt)}</p>
					</>
				)}
			</div>
		</Link>
	);
};

export default ToDoExamCard;
