import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { auth } from '@/utils/auth';
import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ToDoExamCard from '@/components/StudentDashboard/ToDoExamCard';
import UpcomingExamCard from '@/components/StudentDashboard/UpcomingExamCard';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté (garanti par le middleware)
	const session = await auth();
	const idStudent = session!.user!.idUser

	// Récupérer les données en parallèle avec limit = 5
	const [pendingExamsResponse, completedExamsResponse, commingExamsResponse, degreeResponse] = await Promise.all([
		getExamsOfClass(idClassNumber, { status: 'pending', limit: 5 }),
		getExamsOfClass(idClassNumber, { status: 'completed', limit: 5 }),
		getExamsOfClass(idClassNumber, { status: 'comming', limit: 5 }),
		getClassDegree(idClassNumber),
	]);

	// Vérification des erreurs - NextJs redirigera vers la page d'erreur par défaut
	if (
		!('success' in pendingExamsResponse) ||
		!('success' in completedExamsResponse) ||
		!('success' in commingExamsResponse) ||
		!('success' in degreeResponse)
	) {
		throw new Error('Erreur lors de la récupération des données du dashboard');
	}	

	// Récupérer les examGrade pour chaque examen
	const pendingExamsWithGrades: ExamWithGrade[] = await Promise.all(
		pendingExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClassNumber, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const completedExamsWithGrades: ExamWithGrade[] = await Promise.all(
		completedExamsResponse.data.map(async (exam) => {
			const gradeResponse = await getExamGradeOneStudent(idStudent, idClassNumber, exam.idExam);
			return {
				...exam,
				examGrade: 'success' in gradeResponse ? gradeResponse.data : null,
			};
		})
	);

	const degreeName = degreeResponse.data.name;


	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Bonjour {session!.user.name}
					</h1>
					<p className="text-gray-600">Voici un aperçu de vos examens et résultats - {degreeName}</p>
					<p className="text-sm text-gray-500 mt-1">
						Aujourd&apos;hui{' '}
						{new Date().toLocaleDateString('fr-FR', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
					</p>
				</div>

				{/* Examens à faire */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-gray-900">Examens à faire</h2>
						<span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
							{pendingExamsWithGrades.length} examen{pendingExamsWithGrades.length > 1 ? 's' : ''}
						</span>
					</div>

					{pendingExamsWithGrades.length === 0 ? (
						<div className="bg-white rounded-xl shadow-lg p-8 text-center">
							<DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">Aucun examen à faire pour le moment</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pendingExamsWithGrades.map((exam) => (
								<ToDoExamCard key={exam.idExam} exam={exam} idClass={idClassNumber} idStudent={idStudent} />
							))}
						</div>
					)}
				</div>

				{/* Examens à venir */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-gray-900">Examens à venir</h2>
						<span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
							{commingExamsResponse.data.length} examen{commingExamsResponse.data.length > 1 ? 's' : ''}
						</span>
					</div>

					{commingExamsResponse.data.length === 0 ? (
						<div className="bg-white rounded-xl shadow-lg p-8 text-center">
							<CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">Aucun examen à venir</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{commingExamsResponse.data.map((exam) => (
								<UpcomingExamCard key={exam.idExam} exam={exam} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default page;
