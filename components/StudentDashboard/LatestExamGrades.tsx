import { getExamGradesForStudentInClass } from '@/backend_requests/exam_grades/getExamGradesForStudentInClass';
import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { DocumentTextIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface LatestExamGradesProps {
	idClass: number;
	idStudent: number;
}

const LatestExamGrades = async ({ idClass, idStudent }: LatestExamGradesProps) => {
	const latestExamGrades = await getExamGradesForStudentInClass(idClass, idStudent, { limit: 5, status: 'corrected' });

	if (!('success' in latestExamGrades)) {
		throw new Error('Erreur lors de la récupération des notes');
	}

	const examGradesWithExamInfos = await Promise.all(
		latestExamGrades.data.map(async (eg) => {
			const examInfosResponse = await getOneExam(eg.idExam);

			if (!('success' in examInfosResponse)) {
				throw new Error("Erreur lors de la récupération des informations de l'examen");
			}

			return {
				...eg,
				examInfo: examInfosResponse.data,
			};
		})
	);

	return (
		<div className="w-full">
			<h2 className="text-xl font-bold text-gray-900 mb-4">Dernières notes</h2>

			{examGradesWithExamInfos.length === 0 ? (
				<div className="bg-white border border-black/10 rounded-md p-8 text-center">
					<TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500">Aucune note disponible pour le moment</p>
				</div>
			) : (
				<div className="flex gap-4 overflow-x-auto p-4 bg-white border border-black/10 rounded-md ">
					{examGradesWithExamInfos.map((examGrade) => {
						const note = examGrade.note ?? 0;
						const noteColor = note >= 16 ? 'text-green-600' : note >= 12 ? 'text-blue-600' : note >= 10 ? 'text-orange-500' : 'text-red-600';
						const bgColor = note >= 16 ? 'bg-green-100' : note >= 12 ? 'bg-blue-100' : note >= 10 ? 'bg-orange-100' : 'bg-red-100';

						return (
							<Link
								href={`/student/${idClass}/${idStudent}/${examGrade.idExam}`}
								key={examGrade.idExamGrade}
								className="bg-white rounded-lg border border-black/10 p-4 min-w-[250px] flex-shrink-0 "
							>
								{/* En-tête avec icône */}
								<div className="flex items-start gap-3 mb-3">
									<div className={`${bgColor} p-2 rounded-lg flex-shrink-0`}>
										<DocumentTextIcon className={`w-5 h-5 ${noteColor}`} />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-gray-900 text-sm truncate" title={examGrade.examInfo.title}>
											{examGrade.examInfo.title}
										</h3>
										<p className="text-xs text-gray-500">
											{new Date(examGrade.updatedAt || examGrade.createdAt).toLocaleDateString('fr-FR', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</p>
									</div>
								</div>

								{/* Note */}
								<div className="flex items-center justify-between pt-3 border-t border-gray-100">
									<span className="text-sm text-gray-600 font-medium">Note</span>
									<span className={`text-2xl font-bold ${noteColor}`}>{note}/20</span>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default LatestExamGrades;
