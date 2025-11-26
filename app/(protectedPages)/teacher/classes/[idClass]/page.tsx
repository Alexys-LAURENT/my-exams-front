import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import ExamRelationClassCard from '@/components/TeacherClassByIdPage/ExamRelationClassCard';
import { auth } from '@/utils/auth';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { AcademicCapIcon, ArrowLeftIcon, CalendarIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const session = await auth();
	if (!session) {
		throw new Error('Utilisateur non authentifié');
	}
	if (session.user.accountType !== 'teacher') {
		throw new Error('Accès non autorisé');
	}
	const idClass = parseInt((await params).idClass);
	const [classResponse, degreeResponse, studentsResponse, examsResponse] = await Promise.all([getOneClass(idClass), getClassDegree(idClass), getStudentsOfClass(idClass), getExamsOfClass(idClass)]);

	if (!('success' in classResponse) || !('success' in degreeResponse) || !('success' in studentsResponse) || !('success' in examsResponse)) {
		throw new Error('Erreur lors du chargement des données');
	}

	const classe = classResponse.data;
	const degree = degreeResponse.data;
	const students = studentsResponse.data;
	const examsData = examsResponse.data;
	const exams = examsData.filter((exam) => exam.idTeacher === session.user.idUser);

	return (
		<div className="flex flex-col gap-8 p-6 pb-0">
			{/* Bandeau bleu avec infos de la classe */}
			<div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6">
				<Link href="/teacher/classes" className="inline-flex items-center text-white hover:text-blue-200 mb-4 font-medium transition-colors">
					<ArrowLeftIcon className="w-4 h-4 mr-2" />
					Retour aux classes
				</Link>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex items-center gap-3 text-white">
						<AcademicCapIcon className="w-8 h-8" />
						<div>
							<p className="text-sm text-blue-200">Classe</p>
							<p className="text-lg font-bold">{`${classe.name} ${degree.name}`}</p>
						</div>
					</div>

					<div className="flex items-center gap-3 text-white">
						<CalendarIcon className="w-8 h-8" />
						<div>
							<p className="text-sm text-blue-200">Date de début</p>
							<p className="text-lg font-bold">{formatDateWithShortMonth(classe.startDate)}</p>
						</div>
					</div>

					<div className="flex items-center gap-3 text-white">
						<CalendarIcon className="w-8 h-8" />
						<div>
							<p className="text-sm text-blue-200">Date de fin</p>
							<p className="text-lg font-bold">{formatDateWithShortMonth(classe.endDate)}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Section Élèves */}
			<div className="bg-white rounded-xl p-6">
				<div className="flex items-center gap-3 mb-6">
					<UsersIcon className="w-6 h-6 text-blue-600" />
					<h2 className="text-2xl font-bold text-gray-900">Élèves</h2>
					<span className="text-sm text-gray-500">({students.length})</span>
				</div>
				{students.length === 0 ? (
					<div className="text-center py-12">
						<UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">Aucun élève dans cette classe</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Prénom</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
								</tr>
							</thead>
							<tbody>
								{students.map((student, index) => (
									<tr key={student.idUser} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
										<td className="py-3 px-4 text-gray-900">{student.lastName}</td>
										<td className="py-3 px-4 text-gray-900">{student.name}</td>
										<td className="py-3 px-4 text-gray-600">{student.email}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Section Examens */}
			<div className="bg-white rounded-xl p-6">
				<div className="flex items-center gap-3 mb-6">
					<DocumentTextIcon className="w-6 h-6 text-blue-600" />
					<h2 className="text-2xl font-bold text-gray-900">Mes examens pour la classe</h2>
					<span className="text-sm text-gray-500">({exams.length})</span>
				</div>
				{exams.length === 0 ? (
					<div className="text-center py-12">
						<DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">Aucun examen attribué à cette classe</p>
					</div>
				) : (
					<div className="space-y-3">
						{exams.map((exam) => (
							<ExamRelationClassCard key={exam.idExam} exam={exam} idClass={classe.idClass} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
