import { Class, Degree } from '@/types/entitties';
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

type ClassWithDegree = Class & { degree: Degree | null };

const ClassComp = ({ classe, idExam }: { classe: ClassWithDegree; idExam: number }) => {
	return (
		<Link href={`/teacher/classes/${classe.idClass}`} className="block bg-white hover:bg-gray-50 transition-colors duration-200 px-4 py-3 rounded border-b border-gray-300 last:border-b-0">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<AcademicCapIcon className="w-5 h-5 text-indigo-600" />
					<div>
						<p className="text-gray-900 font-medium">{classe.degree?.name || 'Diplôme non défini'}</p>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<CalendarIcon className="w-4 h-4" />
							<span>
								{formatDateWithShortMonth(classe.startDate)} - {formatDateWithShortMonth(classe.endDate)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ClassComp;
