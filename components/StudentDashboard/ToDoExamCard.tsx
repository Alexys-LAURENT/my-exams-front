import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type PendingExamCardProps = {
	exam: ExamWithGrade;
	idClass: number;
	idStudent: number;
};

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

// Fonction pour formater le temps
const formatTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0) {
		return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
	}
	return `${mins}min`;
};

const PendingExamCard = ({ exam, idClass, idStudent }: PendingExamCardProps) => {
	return (
		<Link
			href={`/student/${idStudent}/${exam.idExam}`}
			className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
		>
			{/* Image de l'examen */}
			<div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
				{exam.imagePath ? (
					<img src={exam.imagePath} alt={exam.title} className="w-full h-full object-cover" />
				) : (
					<div className="flex items-center justify-center h-full">
						<DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
					</div>
				)}
			</div>

			<div className="p-6">
				{/* Titre */}
				<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>

				{/* Description */}
				{exam.desc && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.desc}</p>}

				{/* Informations */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center text-sm text-gray-600">
						<ClockIcon className="w-4 h-4 mr-2" />
						<span>Durée : {formatTime(exam.time)}</span>
					</div>
					<div className="text-sm text-gray-600">
						<span className="font-medium">Disponible jusqu&apos;au :</span> {formatDate(exam.end_date)}
					</div>
				</div>

				{/* Statut */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-200">
					{exam.examGrade ? (
						<>
							<span className="text-sm text-gray-600">Statut : {exam.examGrade.status}</span>
							{exam.examGrade.note !== null && (
								<span className="text-lg font-bold text-indigo-600">{exam.examGrade.note}/20</span>
							)}
						</>
					) : (
						<span className="text-sm text-gray-600">Pas encore commencé</span>
					)}
				</div>
			</div>
		</Link>
	);
};

export default PendingExamCard;
