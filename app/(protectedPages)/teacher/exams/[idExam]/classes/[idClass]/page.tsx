import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import { getClassAverageForExam } from '@/backend_requests/stats/getClassAverageForExam';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import TimerIcon from '@/components/svg/TimerIcon';
import TableStudentsForExamAndClass from '@/components/TeacherExamClassPage/TableStudentsForExamAndClass';
import { formatExamTime } from '@/utils/formatExamTime';
import moment from 'moment';
import Link from 'next/link';

const Page = async ({ params }: { params: Promise<{ idExam: string; idClass: string }> }) => {
	const idExam = parseInt((await params).idExam);
	const idClass = parseInt((await params).idClass);

	const [examResponse, classResponse, degreeResponse, studentsResponse, examClassResponse, generaleAverageClassResponse] = await Promise.all([
		getOneExam(idExam),
		getOneClass(idClass),
		getClassDegree(idClass),
		getStudentsOfClass(idClass),
		getExamClass(idExam, idClass),
		getClassAverageForExam(idExam, idClass),
	]);

	if (
		!('success' in examResponse) ||
		!('success' in classResponse) ||
		!('success' in degreeResponse) ||
		!('success' in studentsResponse) ||
		!('success' in examClassResponse) ||
		!('success' in generaleAverageClassResponse)
	) {
		throw new Error("Erreur lors du chargement de l'examen");
	}
	const exam = examResponse.data;
	const classe = classResponse.data;
	const degree = degreeResponse.data;
	const students = studentsResponse.data;
	const examClass = examClassResponse.data;
	const generaleAverageClass = generaleAverageClassResponse.data;

	const examStatus = () => {
		const now = moment();
		const startDate = moment(examClass.start_date);
		const endDate = moment(examClass.end_date);

		if (now.isAfter(endDate)) {
			return 'Terminé';
		} else if (now.isBetween(startDate, endDate)) {
			return 'Réalisable';
		} else {
			return 'À venir';
		}
	};

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
				}

				if ('exists' in gradeResponse && gradeResponse.exists === false) {
					return {
						...student,
						examGrade: null,
						status: 'pas remis' as const,
					};
				}

				throw new Error("Erreur lors de la récupération de la note de l'élève");
			} catch (error) {
				throw error;
			}
		})
	);

	return (
		<div className="flex flex-col w-full gap-6 p-4 mx-auto md:p-6">
			{/* Backlink */}
			<Link href={`/teacher/exams/${idExam}`} className="inline-flex items-center font-medium">
				← Retour à l&apos;examen
			</Link>

			{/* Bloc d'informations de l'examen */}
			<div className="p-6 bg-white border rounded-lg border-black/10">
				<div className="flex flex-col items-start justify-between gap-2 mb-4 md:gap-0 md:flex-row">
					<div className="flex flex-row gap-4">
						<div className="hidden w-24 h-24 bg-gray-300 rounded-lg md:block"></div>
						<div>
							<h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
							{exam.desc && <p className="text-gray-600">{exam.desc}</p>}
							<p className="text-sm text-gray-600">
								{`Réalisable du ${moment(examClass.start_date).format('DD/MM/YYYY HH:mm')} au ${moment(examClass.end_date).format('DD/MM/YYYY HH:mm')}`}
							</p>
						</div>
					</div>
					<div className="flex items-center w-full px-3 py-1 rounded-lg md:w-fit bg-gray-200/50">
						<TimerIcon className="inline w-4 mr-2 md:w-6 aspect-square fill-blue-500" />
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(exam.time * 60)}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
					<div className="p-3 rounded-md bg-indigo-50">
						<p className="text-sm text-gray-600">Classe</p>
						<p className="text-lg font-semibold text-indigo-700">{`${classe.name} ${degree.name}`}</p>
						<p className="text-xs ">
							{moment(classe.startDate).format('DD/MM/YYYY')} - {moment(classe.endDate).format('DD/MM/YYYY')}
						</p>
					</div>
					<div className="p-3 rounded-md bg-purple-50">
						<p className="text-sm text-gray-600">Statut de l&apos;examen</p>
						<p className="text-lg font-semibold text-purple-700">{examStatus()}</p>
					</div>
					<div className="p-3 rounded-md bg-blue-50">
						<p className="text-sm text-gray-600">Élèves</p>
						<p className="text-lg font-semibold text-blue-700">{students.length}</p>
					</div>
					<div className="p-3 rounded-md bg-teal-50">
						<p className="text-sm text-gray-600">Moyenne générale de la classe</p>
						<p className="text-lg font-semibold text-teal-700">{generaleAverageClass.average}/20</p>
					</div>
				</div>
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div className="p-4 text-center bg-white border rounded-lg border-black/10">
					<p className="text-2xl font-bold text-blue-600">{studentsWithStatus.filter((s) => s.status === 'en cours').length}</p>
					<p className="text-sm text-blue-600">En cours</p>
				</div>
				<div className="p-4 text-center bg-white border rounded-lg border-black/10">
					<p className="text-2xl font-bold text-yellow-600">{studentsWithStatus.filter((s) => s.status === 'à corrigé').length}</p>
					<p className="text-sm text-yellow-600">À corriger</p>
				</div>
				<div className="p-4 text-center bg-white border rounded-lg border-black/10">
					<p className="text-2xl font-bold text-green-600">{studentsWithStatus.filter((s) => s.status === 'corrigé').length}</p>
					<p className="text-sm text-green-600">Corrigés</p>
				</div>
				<div className="p-4 text-center bg-white border rounded-lg border-black/10">
					<p className="text-2xl font-bold text-gray-600">{studentsWithStatus.filter((s) => s.status === 'pas remis').length}</p>
					<p className="text-sm text-gray-600">Pas remis</p>
				</div>
			</div>

			{/* Tableau des élèves */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Liste des élèves ({studentsWithStatus.length})</h2>
				</div>
				<div className="p-6">
					{studentsWithStatus.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Aucun élève dans cette classe</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<TableStudentsForExamAndClass studentsWithStatus={studentsWithStatus} idClass={idClass} exam={exam} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
