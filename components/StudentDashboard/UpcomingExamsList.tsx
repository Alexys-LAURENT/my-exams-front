import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { CalendarIcon } from '@heroicons/react/24/outline';
import UpcomingExamCard from './UpcomingExamCard';

interface UpcomingExamsListProps {
	idClass: number;
}

const UpcomingExamsList = async ({ idClass }: UpcomingExamsListProps) => {
	// Récupérer les examens à venir
	const upcomingExamsResponse = await getExamsOfClass(idClass, { status: 'comming', limit: 5 });

	if (!('success' in upcomingExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens à venir');
	}

	const upcomingExams = upcomingExamsResponse.data;

	return (
		<div className="">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<CalendarIcon className="w-6 h-6 text-yellow-600" />
					<h2 className="text-xl font-bold text-gray-900">Examens à venir</h2>
				</div>
				<span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
					{upcomingExams.length} examen{upcomingExams.length > 1 ? 's' : ''}
				</span>
			</div>

			{upcomingExams.length === 0 ? (
				<div className="bg-white rounded-md border border-black/10 p-8 text-center">
					<CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">Aucun examen à venir pour le moment</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{upcomingExams.map((exam) => (
						<UpcomingExamCard key={exam.idExam} exam={exam} />
					))}
				</div>
			)}
		</div>
	);
};

export default UpcomingExamsList;
