import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import { Class, Degree } from '@/types/entitties';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Chip } from '@heroui/chip';
import Link from 'next/link';
import RemoveClassFromExamButton from './RemoveClassFromExamButton';

type ClassWithDegree = Class & { degree: Degree };

const ClassComp = async ({ classe, idExam }: { classe: ClassWithDegree; idExam: number }) => {
	const examClassReponse = await getExamClass(idExam, classe.idClass);

	if (!('success' in examClassReponse)) {
		throw new Error("Erreur lors du chargement de l'examen");
	}

	const examClass = examClassReponse.data;

	// Vérifier si la date de début est passée
	const now = new Date();
	const startDate = new Date(examClass.start_date);
	const endDate = new Date(examClass.end_date);
	const isStartDatePassed = now > startDate;

	// Déterminer le statut de l'examen
	let statusLabel: string;
	let statusColor: 'default' | 'primary' | 'success' | 'warning' | 'danger';

	if (now < startDate) {
		statusLabel = 'Pas commencé';
		statusColor = 'default';
	} else if (now >= startDate && now <= endDate) {
		statusLabel = 'En cours';
		statusColor = 'primary';
	} else {
		statusLabel = 'Terminé';
		statusColor = 'success';
	}

	return (
		<div className="relative block bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-300 last:border-b-0 group">
			<Link href={`/teacher/exams/${idExam}/classes/${classe.idClass}`} className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-4 flex-1">
					<AcademicCapIcon className="w-5 h-5 text-indigo-600" />
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<p className="text-gray-900 font-medium">{`${classe.name} ${classe.degree.name}`}</p>
							<Chip size="sm" color={statusColor} variant="flat">
								{statusLabel}
							</Chip>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<CalendarIcon className="w-4 h-4" />
							<span>
								{formatDateWithShortMonth(examClass.start_date, true)} - {formatDateWithShortMonth(examClass.end_date, true)}
							</span>
						</div>
					</div>
				</div>
			</Link>
			{!isStartDatePassed && (
				<div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
					<RemoveClassFromExamButton idClass={classe.idClass} idExam={idExam} className={`${classe.name} ${classe.degree.name}`} />
				</div>
			)}
		</div>
	);
};

export default ClassComp;
