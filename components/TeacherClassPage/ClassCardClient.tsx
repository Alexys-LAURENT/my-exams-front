'use client';
import { Class, Degree } from '@/types/entitties';
import formatDate from '@/utils/formatDateWithShortMonth';
import { ArrowRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ClassCardClientProps = {
	classe: Class;
	degree: Degree;
	studentsCount: number;
};

const ClassCardClient = ({ classe, degree, studentsCount }: ClassCardClientProps) => {
	return (
		<Link
			href={`/teacher/classes/${classe.idClass}`}
			className="block bg-white hover:bg-slate-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 group"
		>
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors">{`${classe.name} ${degree.name}`}</p>
					<div className="flex items-center gap-3 mt-1">
						<p className="text-xs text-gray-500">
							Du {formatDate(classe.startDate)}, jusqu&apos;au {formatDate(classe.endDate)}
						</p>
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<UserGroupIcon className="w-3.5 h-3.5" />
							<span>
								{studentsCount} étudiant{studentsCount > 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</div>
				<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
			</div>
		</Link>
	);
};

export default ClassCardClient;
