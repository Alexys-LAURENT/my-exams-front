import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import { getOneMatiere } from '@/backend_requests/matieres/getOneMatiere';
import { Exam } from '@/types/entitties';
import formatDate from '@/utils/formatDateWithShortMonth';
import { ArrowRightIcon, BookOpenIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const ExamRelationClassCard = async ({ exam, idClass }: { exam: Exam; idClass: number }) => {
	const [examClassResponse, matiereResponse] = await Promise.all([getExamClass(exam.idExam, idClass), getOneMatiere(exam.idMatiere)]);

	if (!('success' in examClassResponse)) {
		return null;
	}

	const examClass = examClassResponse.data;
	const matiere = 'success' in matiereResponse ? matiereResponse.data : null;

	const now = new Date();
	const start = new Date(examClass.start_date);
	const end = new Date(examClass.end_date);

	let statusColor = 'text-green-600';
	let statusLabel = 'En cours';

	if (now < start) {
		statusColor = 'text-gray-600';
		statusLabel = 'Pas commencé';
	} else if (now > end) {
		statusColor = 'text-red-600';
		statusLabel = 'Fermé';
	}

	return (
		<Link
			href={`/teacher/exams/${exam.idExam}/classes/${idClass}`}
			className="block bg-white hover:bg-slate-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 group"
		>
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors truncate">{exam.title}</p>
						<span className={`text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
					</div>
					<div className="flex items-center gap-3 mt-1">
						{matiere && (
							<div className="flex items-center gap-1 text-xs text-blue-600">
								<BookOpenIcon className="w-3.5 h-3.5" />
								<span>{matiere.nom}</span>
							</div>
						)}
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<CalendarIcon className="w-3.5 h-3.5" />
							<span>
								{formatDate(examClass.start_date)} - {formatDate(examClass.end_date)}
							</span>
						</div>
					</div>
				</div>
				<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
			</div>
		</Link>
	);
};

export default ExamRelationClassCard;
