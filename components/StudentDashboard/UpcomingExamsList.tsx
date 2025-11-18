import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { DASHBOARD_LIMITS } from '@/constants/dashboardLimits';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import UpcomingExamCard from './UpcomingExamCard';

interface UpcomingExamsListProps {
	idClass: number;
}

const UpcomingExamsList = async ({ idClass }: UpcomingExamsListProps) => {
	// Récupérer les examens à venir
	const upcomingExamsResponse = await getExamsOfClass(idClass, { status: 'comming', limit: DASHBOARD_LIMITS.UPCOMING_EXAMS });

	if (!('success' in upcomingExamsResponse)) {
		throw new Error('Erreur lors de la récupération des examens à venir');
	}

	const upcomingExams = upcomingExamsResponse.data;
	const hasMore = upcomingExams.length === DASHBOARD_LIMITS.UPCOMING_EXAMS;

	return (
		<div className="mb-8">
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
				<div className="bg-white rounded-xl border border-black/10 p-8 text-center">
					<CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">Aucun examen à venir pour le moment</p>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{upcomingExams.map((exam) => (
							<UpcomingExamCard key={exam.idExam} exam={exam} />
						))}
						{hasMore && (
							<Link
								href={`/student/${idClass}/exams?status=upcoming`}
								className="bg-yellow-100 border-2 border-dashed border-yellow-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-yellow-200 transition-colors duration-200 min-h-[300px]"
							>
								<CalendarIcon className="w-12 h-12 text-yellow-600 mb-3" />
								<p className="text-yellow-900 font-semibold text-center">Voir tous les examens à venir</p>
								<p className="text-yellow-700 text-sm mt-1">{upcomingExams.length}+ examens</p>
							</Link>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default UpcomingExamsList;
