import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { getExamsOfClass } from '@/backend_requests/exams/getExamsOfClass';
import ToDoExamCard from '@/components/StudentDashboard/ToDoExamCard';
import { ExamGrade, ExamWithDates } from '@/types/entitties';
import { auth } from '@/utils/auth';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

const page = async ({ params }: { params: Promise<{ idClass: string }> }) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté (garanti par le middleware)
	const session = await auth();
	const idStudent = session!.user!.idUser;

	// Récupérer les données en parallèle avec limit = 5
	const [pendingExamsResponse, completedExamsResponse, commingExamsResponse, degreeResponse] = await Promise.all([
		getExamsOfClass(idClassNumber, { status: 'pending', limit: 5 }),
		getExamsOfClass(idClassNumber, { status: 'completed', limit: 5 }),
		getExamsOfClass(idClassNumber, { status: 'comming', limit: 5 }),
		getClassDegree(idClassNumber),
	]);

	// Vérification des erreurs - NextJs redirigera vers la page d'erreur par défaut
	if (!('success' in pendingExamsResponse) || !('success' in completedExamsResponse) || !('success' in commingExamsResponse) || !('success' in degreeResponse)) {
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
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Bonjour {session!.user.name}</h1>
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

				{/* Grid avec Examens à faire et Examens passés */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Examens à faire */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<DocumentTextIcon className="w-6 h-6 text-blue-600" />
								<h2 className="text-xl font-bold text-gray-900">Examens à faire</h2>
							</div>
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
							<>
								<div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
									{pendingExamsWithGrades.map((exam) => (
										<ToDoExamCard key={exam.idExam} idClass={idClassNumber} exam={exam} idStudent={idStudent} />
									))}
								</div>
								<Link
									href={`/student/${idClassNumber}/exams`}
									className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
								>
									Voir les examens
								</Link>
							</>
						)}
					</div>

					{/* Examens passés */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<DocumentTextIcon className="w-6 h-6 text-green-600" />
								<h2 className="text-xl font-bold text-gray-900">Examens passés</h2>
							</div>
							<span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
								{completedExamsWithGrades.length} examen{completedExamsWithGrades.length > 1 ? 's' : ''}
							</span>
						</div>

						{completedExamsWithGrades.length === 0 ? (
							<div className="bg-white rounded-xl shadow-lg p-8 text-center">
								<DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">Aucun examen passé pour le moment</p>
							</div>
						) : (
							<>
								<div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
									{completedExamsWithGrades.map((exam) => (
										<ToDoExamCard key={exam.idExam} idClass={idClassNumber} exam={exam} idStudent={idStudent} />
									))}
								</div>
								<Link
									href={`/student/${idClassNumber}/exams`}
									className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
								>
									Voir les résultats
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
