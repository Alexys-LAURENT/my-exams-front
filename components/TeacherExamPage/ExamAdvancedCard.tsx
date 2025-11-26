'use client';
import { ExamWithAdditionalData } from '@/app/(protectedPages)/teacher/exams/page';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { ArrowRightIcon, BookOpenIcon, CalendarIcon, ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const formatTime = (minutes: number) => {
	if (minutes < 60) {
		return `${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

const ExamAdvancedCard = ({ exam }: { exam: ExamWithAdditionalData }) => {
	return (
		<Link href={`/teacher/exams/${exam.idExam}`} className="block bg-white hover:bg-slate-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 group">
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors truncate">{exam.title}</p>
					<div className="flex items-center gap-3 mt-1 flex-wrap">
						<div className="flex items-center gap-1 text-xs text-blue-600">
							<BookOpenIcon className="w-3.5 h-3.5" />
							<span>{exam.matiere.nom}</span>
						</div>
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<ClockIcon className="w-3.5 h-3.5" />
							<span>{formatTime(exam.time)}</span>
						</div>
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<QuestionMarkCircleIcon className="w-3.5 h-3.5" />
							<span>
								{exam.questionsCount} question{exam.questionsCount !== 1 ? 's' : ''}
							</span>
						</div>
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<CalendarIcon className="w-3.5 h-3.5" />
							<span>Créé le {formatDateWithShortMonth(exam.createdAt)}</span>
						</div>
					</div>
					{exam.desc && <p className="text-xs text-gray-600 mt-1 line-clamp-1">{exam.desc}</p>}
				</div>
				<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
			</div>
		</Link>
	);
};

export default ExamAdvancedCard;
