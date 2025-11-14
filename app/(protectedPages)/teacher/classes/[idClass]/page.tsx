import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import { AcademicCapIcon, CalendarIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import ExamComp from '@/components/TeacherClassByIdPage/examComp';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

const Page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const idClass = parseInt((await params).idClass);
	const classResponse = await getOneClass(idClass);
	if (!('success' in classResponse)) {
		throw new Error('Erreur lors du chargement des classes');
	}
	const classe = classResponse.data;
	const degreeResponse = await getClassDegree(idClass);
	if (degreeResponse && !('success' in degreeResponse)) {
		throw new Error('Erreur lors du chargement du diplôme');
	}
	const degree = degreeResponse.data;
	const studentsResponse = await getStudentsOfClass(idClass);
	if (studentsResponse && !('success' in studentsResponse)) {
		throw new Error('Erreur lors du chargement des élèves');
	}
	const students = studentsResponse.data;
	const examsResponse = await getExamsOfClass(idClass);
	if (examsResponse && !('success' in examsResponse)) {
		throw new Error('Erreur lors du chargement des examens');
	}
	const exams = examsResponse.data;
	if (!classe) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération de la classe</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<Link href="/teacher/classes" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
					Retour aux classes
				</Link>
				<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
					<div className="bg-gray-100 p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<AcademicCapIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Diplôme</p>
									<p className="text-lg font-semibold text-gray-900">{degree?.name || 'Non défini'}</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<CalendarIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Date de début</p>
									<p className="text-lg font-semibold text-gray-900">{formatDateWithShortMonth(classe.startDate)}</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<CalendarIcon className="w-8 h-8 text-indigo-600" />
								<div>
									<p className="text-sm text-gray-600">Date de fin</p>
									<p className="text-lg font-semibold text-gray-900">{formatDateWithShortMonth(classe.endDate)}</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<UsersIcon className="w-6 h-6 text-gray" />
								<h2 className="text-xl font-semibold text-gray">élèves ({students.length})</h2>
							</div>
							<div className="bg-gray-200 rounded-lg p-4">
								{students.length === 0 ? (
									<div className="text-center py-8">
										<UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
										<p className="text-gray-600">Aucun élève dans cette classe</p>
									</div>
								) : (
									<div className="space-y-2">
										{students.map((student) => (
											<div
												key={student.idUser}
												className="block bg-white hover:bg-gray-50 transition-colors duration-200 px-4 py-3 rounded border-b border-gray-300 last:border-b-0"
											>
												<div className="flex items-center justify-between">
													<span className="text-gray-900">
														{student.name} {student.lastName}
													</span>
													<span className="text-sm text-gray-500">{student.email}</span>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
							<div className="flex items-center gap-3 mb-4">
								<DocumentTextIcon className="w-6 h-6 text-gray" />
								<h2 className="text-xl font-semibold text-gray">examens de la classe ({exams.length})</h2>
							</div>
							<div className="bg-gray-200 rounded-lg p-4">
								{exams.length === 0 ? (
									<div className="text-center py-8">
										<DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
										<p className="text-gray-600">Aucun examens attribué à cette classe</p>
									</div>
								) : (
									<div className="space-y-2">
										{exams.map((exam) => (
											<ExamComp key={exam.idExam} exam={exam} idClass={classe.idClass} />
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
