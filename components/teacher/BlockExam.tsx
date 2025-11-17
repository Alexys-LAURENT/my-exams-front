'use client';

import Link from 'next/link';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import formatDate from '@/utils/formatDateWithShortMonth';
import { Exam } from '@/types/entitties';

const BlockExam = ({ recentExams }: { recentExams: Exam[] }) => {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
			<div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h2 className="text-2xl font-bold mb-1">Mes Examens</h2>
						<p className="text-amber-100 text-sm">Les 5 derniers examens</p>
					</div>
					<DocumentTextIcon className="w-12 h-12 opacity-80" />
				</div>
			</div>
			<div className="flex-1 p-6">
				{recentExams.length === 0 ? (
					<div className="text-center py-8">
						<DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">Aucun examen</p>
					</div>
				) : (
					<div className="space-y-3">
						{recentExams.map((exam) => (
							<Link
								key={exam.idExam}
								href={`/teacher/exams/${exam.idExam}`}
								className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-amber-300 group"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1 min-w-0">
										<p className="text-gray-900 font-medium group-hover:text-amber-700 transition-colors truncate">{exam.title}</p>
										<p className="text-xs text-gray-500 mt-1">Créé le {formatDate(exam.createdAt)}</p>
									</div>
									<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
			<div className="p-6 pt-0">
				<Link
					href="/teacher/exams"
					className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center shadow-md hover:shadow-lg"
				>
					Voir tous les examens
				</Link>
			</div>
		</div>
	);
};

export default BlockExam;
