import { ExamWithAdditionalData } from '@/app/(protectedPages)/teacher/exams/page';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { CalendarIcon, ClockIcon, DocumentTextIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/dist/client/link';

const formatTime = (minutes: number) => {
	if (minutes < 60) {
		return `${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

const ExamComp = ({ exam }: { exam: ExamWithAdditionalData }) => {
	return (
		<Link
			key={exam.idExam}
			href={`/teacher/exams/${exam.idExam}`}
			className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-200 px-6 py-4 rounded-lg border border-gray-200 hover:border-amber-300 group"
		>
			<div className="flex items-center justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="mb-2">
						<h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors truncate">{exam.title}</h3>
					</div>

					<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
						<div className="flex items-center gap-1">
							<ClockIcon className="w-4 h-4 text-amber-500" />
							<span>{formatTime(exam.time)}</span>
						</div>
						<div className="flex items-center gap-1">
							<QuestionMarkCircleIcon className="w-4 h-4 text-amber-500" />
							<span>
								{exam.questionsCount} question{exam.questionsCount !== 1 ? 's' : ''}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<CalendarIcon className="w-4 h-4 text-amber-500" />
							<span>Créé le {formatDateWithShortMonth(exam.createdAt)}</span>
						</div>
						<div className="flex items-center gap-1">
							<DocumentTextIcon className="w-4 h-4 text-amber-500" />
							<span>{exam.matiere.nom}</span>
						</div>
					</div>

					{exam.desc && <p className="text-sm text-gray-600 mt-2 line-clamp-1">{exam.desc}</p>}
				</div>

				<div className="flex-shrink-0">
					<span className="text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">Voir détails →</span>
				</div>
			</div>
		</Link>
	);
};

export default ExamComp;
