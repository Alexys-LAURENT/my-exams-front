import { ExamWithDates } from '@/types/entitties';
import { DocumentTextIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

type UpcomingExamCardProps = {
	exam: ExamWithDates;
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

const UpcomingExamCard = ({ exam }: UpcomingExamCardProps) => {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed">
			{/* Image de l'examen */}
			<div className="h-32 bg-gradient-to-br from-gray-400 to-gray-600 relative">
				{exam.imagePath ? (
					<img src={exam.imagePath} alt={exam.title} className="w-full h-full object-cover grayscale" />
				) : (
					<div className="flex items-center justify-center h-full">
						<DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
					</div>
				)}
				<div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
					Bientôt
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
						<span className="font-medium">Disponible à partir du :</span>
					</div>
					<div className="text-sm text-indigo-600 font-medium ml-6">{formatDate(exam.start_date)}</div>
				</div>

				{/* Message */}
				<div className="pt-4 border-t border-gray-200">
					<p className="text-sm text-gray-500 italic">Cet examen n&apos;est pas encore disponible</p>
				</div>
			</div>
		</div>
	);
};

export default UpcomingExamCard;
