'use client';

import { ExamWithExtendedClassDates } from '@/app/(protectedPages)/teacher/dashboard/page';
import { ArrowRightIcon, CalendarIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Link from 'next/link';

const BlockActiveExams = ({ activeExams }: { activeExams: ExamWithExtendedClassDates[] }) => {
	const now = new Date();

	// Créer une liste de combos exam-classe actifs et les trier par date de début
	const activeExamClasses = activeExams
		.flatMap((exam) => exam.examClasses.map((examClass) => ({ exam, examClass })))
		.sort((a, b) => new Date(a.examClass.start_date).getTime() - new Date(b.examClass.start_date).getTime());

	// Catégoriser chaque combo
	const categorized = activeExamClasses.map(({ exam, examClass }) => {
		const startDate = new Date(examClass.start_date);
		const endDate = new Date(examClass.end_date);
		const isOngoing = startDate <= now && now <= endDate;
		const isUpcoming = startDate > now;
		return {
			exam,
			examClass,
			isOngoing,
			isUpcoming,
		};
	});

	const ongoingCombos = categorized.filter((c) => c.isOngoing);
	const upcomingCombos = categorized.filter((c) => c.isUpcoming);

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
			<div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h2 className="text-2xl font-bold mb-1">Examens Actifs</h2>
						<p className="text-emerald-100 text-sm">En cours et à venir</p>
					</div>
					<ClockIcon className="w-12 h-12 opacity-80" />
				</div>
			</div>
			<div className="flex-1 p-6">
				{ongoingCombos.length === 0 && upcomingCombos.length === 0 ? (
					<div className="text-center py-8">
						<ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">Aucun examen en cours ou à venir</p>
					</div>
				) : (
					<div className="space-y-4">
						{ongoingCombos.length > 0 && (
							<div>
								<div className="flex items-center gap-2 mb-3">
									<PlayIcon className="w-4 h-4 text-emerald-600" />
									<h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">En cours ({ongoingCombos.length})</h3>
								</div>
								<div className="space-y-2">
									{ongoingCombos.map((combo) => (
										<Link
											key={`${combo.exam.idExam}-${combo.examClass.idClass}`}
											href={`/teacher/exams/${combo.exam.idExam}`}
											className="block bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 px-4 py-3 rounded-lg border border-emerald-200 hover:border-emerald-300 group"
										>
											<div className="flex items-center justify-between">
												<div className="flex-1 min-w-0">
													<p className="text-gray-900 font-medium group-hover:text-emerald-700 transition-colors truncate">{combo.exam.title}</p>
													<p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
														<span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
														En cours pour {combo.examClass.classe.name} de {moment(combo.examClass.start_date).format('HH:mm')} à{' '}
														{moment(combo.examClass.end_date).format('HH:mm')}
													</p>
												</div>
												<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
											</div>
										</Link>
									))}
								</div>
							</div>
						)}

						{upcomingCombos.length > 0 && (
							<div>
								<div className="flex items-center gap-2 mb-3">
									<CalendarIcon className="w-4 h-4 text-blue-600" />
									<h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">À venir ({upcomingCombos.length})</h3>
								</div>
								<div className="space-y-2">
									{upcomingCombos.map((combo) => (
										<Link
											key={`${combo.exam.idExam}-${combo.examClass.idClass}`}
											href={`/teacher/exams/${combo.exam.idExam}`}
											className="block bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 px-4 py-3 rounded-lg border border-blue-200 hover:border-blue-300 group"
										>
											<div className="flex items-center justify-between">
												<div className="flex-1 min-w-0">
													<p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors truncate">{combo.exam.title}</p>
													<p className="text-xs text-blue-600 mt-1">
														Pour {combo.examClass.classe.name} du {moment(combo.examClass.start_date).format('DD/MM/YYYY HH:mm')} au{' '}
														{moment(combo.examClass.end_date).format('DD/MM/YYYY HH:mm')}
													</p>
												</div>
												<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
											</div>
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default BlockActiveExams;
