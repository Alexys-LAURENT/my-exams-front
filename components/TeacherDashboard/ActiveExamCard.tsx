import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { ExamClass } from '@/types/entitties';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Link from 'next/link';

const ActiveExamCard = async ({ examClass }: { examClass: ExamClass }) => {
	const [examResponse, classResponse] = await Promise.all([getOneExam(examClass.idExam), getOneClass(examClass.idClass)]);

	if (!('success' in examResponse) || !('success' in classResponse)) {
		return null;
	}

	const exam = examResponse.data;
	const classe = classResponse.data;

	const now = new Date();
	const startDate = new Date(examClass.start_date);
	const endDate = new Date(examClass.end_date);
	const isOngoing = startDate <= now && now <= endDate;

	return (
		<Link
			href={`/teacher/exams/${exam.idExam}/classes/${classe.idClass}`}
			className={`block bg-white hover:bg-slate-50 transition-all duration-200 px-4 py-3 rounded-lg border ${
				isOngoing ? 'border-green-200 hover:border-green-300' : 'border-blue-200 hover:border-blue-300'
			} group`}
		>
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<p className={`text-gray-900 font-medium transition-colors truncate ${isOngoing ? 'group-hover:text-green-700' : 'group-hover:text-blue-700'}`}>{exam.title}</p>
					{isOngoing ? (
						<p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
							<span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
							En cours pour {classe.name} de {moment(examClass.start_date).format('HH:mm')} à {moment(examClass.end_date).format('HH:mm')}
						</p>
					) : (
						<p className="text-xs text-blue-600 mt-1">
							Pour {classe.name} du {moment(examClass.start_date).format('DD/MM/YYYY HH:mm')} au {moment(examClass.end_date).format('DD/MM/YYYY HH:mm')}
						</p>
					)}
				</div>
				<ArrowRightIcon
					className={`w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2 ${isOngoing ? 'group-hover:text-green-600' : 'group-hover:text-blue-600'}`}
				/>
			</div>
		</Link>
	);
};

export default ActiveExamCard;
