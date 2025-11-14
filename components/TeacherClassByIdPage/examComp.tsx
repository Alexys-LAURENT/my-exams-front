import { Exam } from '@/types/entitties';
import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

const ExamComp = async ({ exam, idClass }: { exam: Exam; idClass: number }) => {
	const examDetailResponse = await getExamClass(exam.idExam, idClass);
	if (!('success' in examDetailResponse)) {
		throw new Error('Erreur lors du chargement des détails des examens');
	}
	const examDetail = examDetailResponse.data;
	const now = new Date();
	const start = new Date(examDetail.start_date);
	const end = new Date(examDetail.end_date);
	let status = 'ongoing';
	if (now < start) {
		status = 'not_started';
	}
	if (now > end) {
		status = 'closed';
	}

	return (
		<div key={exam.idExam} className="block bg-white hover:bg-gray-50 transition-colors duration-200 px-4 py-3 rounded border-b border-gray-300 last:border-b-0">
			<div className="flex items-center justify-between">
				<span className="text-gray-900">{exam.title}</span>
				{status === 'ongoing' && <span className="text-green-600 font-bold">En cours</span>}
				{status === 'closed' && <span className="text-red-600 font-bold">Fermé</span>}
				{status === 'not_started' && <span className="text-gray-600 font-bold">Pas commencé</span>}
			</div>
			<span className="text-sm text-gray-500">
				{formatDateWithShortMonth(examDetail.start_date)} - {formatDateWithShortMonth(examDetail.end_date)}
			</span>
		</div>
	);
};

export default ExamComp;
