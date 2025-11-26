import { getOneMatiere } from '@/backend_requests/matieres/getOneMatiere';
import { Exam } from '@/types/entitties';
import formatDate from '@/utils/formatDateWithShortMonth';
import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const ExamCard = async ({ exam }: { exam: Exam }) => {
	const matiereResponse = await getOneMatiere(exam.idMatiere);
	const matiere = 'success' in matiereResponse ? matiereResponse.data : null;

	return (
		<Link href={`/teacher/exams/${exam.idExam}`} className="block bg-white hover:bg-slate-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 group">
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors truncate">{exam.title}</p>
					<div className="flex items-center gap-3 mt-1">
						{matiere && (
							<div className="flex items-center gap-1 text-xs text-blue-600">
								<BookOpenIcon className="w-3.5 h-3.5" />
								<span>{matiere.nom}</span>
							</div>
						)}
						<p className="text-xs text-gray-500">Créé le {formatDate(exam.createdAt)}</p>
					</div>
				</div>
				<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
			</div>
		</Link>
	);
};

export default ExamCard;
