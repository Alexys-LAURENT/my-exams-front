import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { DocumentTextIcon, ClockIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type ExamCardProps = {
	exam: ExamWithGrade;
	idStudent: number;
	category: 'pending' | 'completed';
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

const ExamCard = ({ exam, idStudent, category }: ExamCardProps) => {
	const isPending = category === 'pending';

	return (
		<Link
			href={`/student/${idStudent}/${exam.idExam}`}
			className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
		>
			{/* Header avec badge de statut */}
			<div className={`h-32 bg-gradient-to-br relative ${isPending ? 'from-indigo-500 to-purple-600' : 'from-green-500 to-emerald-600'}`}>
				{exam.imagePath ? (
					<img src={exam.imagePath} alt={exam.title} className="w-full h-full object-cover" />
				) : (
					<div className="flex items-center justify-center h-full">
						<DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
					</div>
				)}
				<div className="absolute top-2 right-2">
					{isPending ? (
						<span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
							À faire
						</span>
					) : (
						<span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
							<CheckCircleIcon className="w-4 h-4" />
							Passé
						</span>
					)}
				</div>
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
					<div className="flex items-center text-sm text-gray-600">
						<CalendarIcon className="w-4 h-4 mr-2" />
						<span>
							{isPending ? 'Disponible jusqu\'au' : 'Terminé le'} : {formatDate(exam.end_date)}
						</span>
					</div>
				</div>

				{/* Footer avec note ou statut */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-200">
					{exam.examGrade ? (
						<>
							<span className="text-sm text-gray-600">Statut : {exam.examGrade.status}</span>
							{exam.examGrade.note !== null && (
								<span className={`text-lg font-bold ${
									exam.examGrade.note >= 10 ? 'text-green-600' : 'text-red-600'
								}`}>
									{exam.examGrade.note}/20
								</span>
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

export default ExamCard;
