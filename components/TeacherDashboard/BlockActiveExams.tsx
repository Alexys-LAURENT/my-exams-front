import { getActiveAndUpcomingExamsForTeacher } from '@/backend_requests/exams/getActiveAndUpcomingExamsForTeacher';
import { auth } from '@/utils/auth';
import { CalendarIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';
import ActiveExamCard from './ActiveExamCard';

const BlockActiveExams = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;

	// Récupérer les examens actifs et à venir
	const activeExamsResponse = await getActiveAndUpcomingExamsForTeacher(idTeacher, 5);

	if (!('success' in activeExamsResponse)) {
		return (
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h2 className="text-xl font-bold mb-4">Examens Actifs</h2>
				<p className="text-red-500">Erreur lors du chargement des examens actifs</p>
			</div>
		);
	}

	const examClasses = activeExamsResponse.data;

	// Catégoriser en cours et à venir
	const now = new Date();
	const ongoing = examClasses.filter((ec) => {
		const startDate = new Date(ec.start_date);
		const endDate = new Date(ec.end_date);
		return startDate <= now && now <= endDate;
	});

	const upcoming = examClasses.filter((ec) => {
		const startDate = new Date(ec.start_date);
		return startDate > now;
	});

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="mb-6">
				<h2 className="text-xl font-bold mb-1">Examens Actifs</h2>
				<p className="text-gray-600 text-sm">En cours et à venir</p>
			</div>

			{ongoing.length === 0 && upcoming.length === 0 ? (
				<div className="text-center py-8">
					<ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">Aucun examen en cours ou à venir</p>
				</div>
			) : (
				<div className="space-y-4">
					{ongoing.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<PlayIcon className="w-4 h-4 text-green-600" />
								<h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">En cours ({ongoing.length})</h3>
							</div>
							<div className="space-y-2">
								{ongoing.map((examClass) => (
									<ActiveExamCard key={`${examClass.idExam}-${examClass.idClass}`} examClass={examClass} />
								))}
							</div>
						</div>
					)}

					{upcoming.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<CalendarIcon className="w-4 h-4 text-blue-600" />
								<h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">À venir ({upcoming.length})</h3>
							</div>
							<div className="space-y-2">
								{upcoming.map((examClass) => (
									<ActiveExamCard key={`${examClass.idExam}-${examClass.idClass}`} examClass={examClass} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default BlockActiveExams;
