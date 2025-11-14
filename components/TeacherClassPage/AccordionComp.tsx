'use client';
import { Accordion, AccordionItem } from '@heroui/accordion';
import Link from 'next/link';
import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { ClassWithDegree } from '@/app/(protectedPages)/teacher/classes/page';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

const AccordionComp = ({ classesWithDetails }: { classesWithDetails: ClassWithDegree[] }) => {
	const schoolYearKey = (d: Date) => {
		const y = d.getFullYear();
		const m = d.getMonth();
		return m >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
	};
	const groups = classesWithDetails.reduce<Record<string, ClassWithDegree[]>>((acc, c) => {
		const key = schoolYearKey(new Date(c.startDate));
		(acc[key] ||= []).push(c);
		return acc;
	}, {});
	const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

	return (
		<Accordion>
			{years.map((year) => (
				<AccordionItem key={year} aria-label={`Année ${year}`} title={`Année ${year} — ${groups[year].length} classe${groups[year].length > 1 ? 's' : ''}`}>
					<div className="space-y-3">
						{groups[year]
							.slice()
							.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
							.map((classe) => (
								<Link
									key={classe.idClass}
									href={`/teacher/classes/${classe.idClass}`}
									className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 px-6 py-4 rounded-lg border border-gray-200 hover:border-indigo-300 group"
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex-1 min-w-0">
											<div className="mb-2">
												<h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
													{classe.degree ? classe.degree.name : `Classe ${classe.idClass}`}
												</h3>
											</div>

											<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
												<div className="flex items-center gap-1">
													<CalendarIcon className="w-4 h-4 text-indigo-500" />
													<span>Du {formatDateWithShortMonth(classe.startDate)}</span>
												</div>
												<div className="flex items-center gap-1">
													<CalendarIcon className="w-4 h-4 text-indigo-500" />
													<span>Au {formatDateWithShortMonth(classe.endDate)}</span>
												</div>
												<div className="flex items-center gap-1">
													<UsersIcon className="w-4 h-4 text-indigo-500" />
													<span>
														{classe.studentsCount} étudiant{classe.studentsCount !== 1 ? 's' : ''}
													</span>
												</div>
											</div>
										</div>

										<div className="flex-shrink-0">
											<span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">Voir détails →</span>
										</div>
									</div>
								</Link>
							))}
					</div>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default AccordionComp;
