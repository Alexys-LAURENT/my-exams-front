import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { AcademicCapIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

const getStatusLabel = (status: 'en cours' | 'à corrigé' | 'corrigé' | 'pas remis') => {
	switch (status) {
		case 'en cours':
			return { label: 'En cours', color: 'bg-blue-100 text-blue-800' };
		case 'à corrigé':
			return { label: 'À corriger', color: 'bg-yellow-100 text-yellow-800' };
		case 'corrigé':
			return { label: 'Corrigé', color: 'bg-green-100 text-green-800' };
		case 'pas remis':
			return { label: 'Pas remis', color: 'bg-gray-100 text-gray-800' };
	}
};

const Page = async ({ params }: { params: Promise<{ idExam: string; idClass: string }> }) => {
	const idExam = parseInt((await params).idExam);
	const idClass = parseInt((await params).idClass);

	const examResponse = await getOneExam(idExam);
	if (!('success' in examResponse)) {
		throw new Error("Erreur lors du chargement de l'examen");
	}
	const exam = examResponse.data;

	const classResponse = await getOneClass(idClass);
	if (!('success' in classResponse)) {
		throw new Error('Erreur lors du chargement de la classe');
	}
	const classe = classResponse.data;

	const degreeResponse = await getClassDegree(idClass);
	if (!('success' in degreeResponse)) {
		throw new Error('Erreur lors du chargement du diplôme');
	}
	const degree = degreeResponse.data;

	const studentsResponse = await getStudentsOfClass(idClass);
	if (!('success' in studentsResponse)) {
		throw new Error('Erreur lors du chargement des élèves');
	}
	const students = studentsResponse.data;

	const studentsWithStatus = await Promise.all(
		students.map(async (student) => {
			try {
				const gradeResponse = await getExamGradeOneStudent(student.idUser, idClass, idExam);
				if ('success' in gradeResponse) {
					return {
						...student,
						examGrade: gradeResponse.data,
						status: gradeResponse.data.status,
					};
				} else {
					return {
						...student,
						examGrade: null,
						status: 'pas remis' as const,
					};
				}
			} catch (error) {
				return {
					...student,
					examGrade: null,
					status: 'pas remis' as const,
				};
			}
		})
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<Link href={`/teacher/exams/${idExam}`} className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6 font-medium">
					Retour à l'examen
				</Link>

				<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
					<div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
						<h1 className="text-3xl font-bold text-white mb-2">{exam.title}</h1>
						<p className="text-amber-50">Résultats de la classe</p>
					</div>

					<div className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
								<AcademicCapIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Diplôme</p>
									<p className="text-lg font-semibold text-gray-900">{degree?.name || 'Non défini'}</p>
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
								<CalendarIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Période de la classe</p>
									<p className="text-sm font-semibold text-gray-900">
										{formatDateWithShortMonth(classe.startDate)} - {formatDateWithShortMonth(classe.endDate)}
									</p>
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
								<UsersIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Élèves</p>
									<p className="text-lg font-semibold text-gray-900">{students.length}</p>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div className="bg-blue-50 p-4 rounded-lg text-center">
								<p className="text-2xl font-bold text-blue-600">{studentsWithStatus.filter((s) => s.status === 'en cours').length}</p>
								<p className="text-sm text-blue-600">En cours</p>
							</div>
							<div className="bg-yellow-50 p-4 rounded-lg text-center">
								<p className="text-2xl font-bold text-yellow-600">{studentsWithStatus.filter((s) => s.status === 'à corrigé').length}</p>
								<p className="text-sm text-yellow-600">À corriger</p>
							</div>
							<div className="bg-green-50 p-4 rounded-lg text-center">
								<p className="text-2xl font-bold text-green-600">{studentsWithStatus.filter((s) => s.status === 'corrigé').length}</p>
								<p className="text-sm text-green-600">Corrigés</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-lg text-center">
								<p className="text-2xl font-bold text-gray-600">{studentsWithStatus.filter((s) => s.status === 'pas remis').length}</p>
								<p className="text-sm text-gray-600">Pas remis</p>
							</div>
						</div>
						<div className="flex items-center gap-3 mb-4">
							<UsersIcon className="w-6 h-6 text-gray-700" />
							<h2 className="text-xl font-semibold text-gray-900">Liste des élèves</h2>
						</div>

						<div className="bg-gray-50 rounded-lg overflow-hidden">
							{studentsWithStatus.length === 0 ? (
								<div className="text-center py-8">
									<UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
									<p className="text-gray-600">Aucun élève dans cette classe</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-200">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Élève</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Note</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{studentsWithStatus.map((student) => {
												const statusInfo = getStatusLabel(student.status);
												return (
													<tr key={student.idUser} className="hover:bg-gray-50 transition-colors">
														<td className="px-6 py-4 whitespace-nowrap">
															<Link href={`/teacher/exams/${idExam}/students/${student.idUser}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
																{student.name} {student.lastName}
															</Link>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-500">{student.email}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{student.examGrade?.note !== null && student.examGrade?.note !== undefined ? `${student.examGrade.note}/20` : '-'}
															</div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
