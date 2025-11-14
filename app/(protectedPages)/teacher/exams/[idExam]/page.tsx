import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { getAllClassesForOneExam } from '@/backend_requests/classes/getClassesForOneExam';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { DocumentTextIcon, CalendarIcon, ClockIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ClassComp from '@/components/TeacherExamByIdPage/ClassComp';
import AddClassToExam from '@/components/TeacherExamByIdPage/AddClassToExam';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

const Page = async ({ params }: { params: { idExam: string } }) => {
	const idExam = await parseInt(params.idExam);

	const examResponse = await getOneExam(idExam);
	if (!('success' in examResponse)) {
		throw new Error("Erreur lors du chargement de l'examen");
	}
	const exam = 'success' in examResponse ? examResponse.data : null;

	const questionsCountResponse = exam ? await getQuestionsCountForOneExam(idExam) : null;
	if (questionsCountResponse && !('success' in questionsCountResponse)) {
		throw new Error('Erreur lors du chargement du nombre de questions');
	}
	const questionsCount = questionsCountResponse ? parseInt(questionsCountResponse.data) : 0;

	const classesResponse = exam ? await getAllClassesForOneExam(idExam) : null;
	if (classesResponse && !('success' in classesResponse)) {
		throw new Error('Erreur lors du chargement des classes');
	}
	const classes = classesResponse ? classesResponse.data : [];

	const classesWithDegrees = await Promise.all(
		classes.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);
			const degree = degreeResponse && 'success' in degreeResponse ? degreeResponse.data : null;
			return { ...classe, degree };
		})
	);

	if (!exam) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Erreur lors de la récupération de l'examen</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<Link href="/teacher/exams" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6 font-medium">
					Retour aux examens
				</Link>

				<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
					<div className="bg-gray-100 p-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<DocumentTextIcon className="w-8 h-8 text-amber-600" />
								<div>
									<p className="text-sm text-gray-600">Titre</p>
									<p className="text-lg font-semibold text-gray-900">{exam.title}</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<ClockIcon className="w-8 h-8 text-amber-600" />
								<div>
									<p className="text-sm text-gray-600">Durée</p>
									<p className="text-lg font-semibold text-gray-900">{exam.time} min</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<ListBulletIcon className="w-8 h-8 text-amber-600" />
								<div>
									<p className="text-sm text-gray-600">Questions</p>
									<p className="text-lg font-semibold text-gray-900">{questionsCount}</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
								<CalendarIcon className="w-8 h-8 text-amber-600" />
								<div>
									<p className="text-sm text-gray-600">Créé le</p>
									<p className="text-lg font-semibold text-gray-900">{formatDateWithShortMonth(exam.createdAt)}</p>
								</div>
							</div>
						</div>

						{exam.desc && (
							<div className="bg-white p-4 rounded-lg shadow-sm mb-6">
								<p className="text-sm text-gray-600 mb-2">Description</p>
								<p className="text-gray-900">{exam.desc}</p>
							</div>
						)}

						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<DocumentTextIcon className="w-6 h-6 text-gray" />
									<h2 className="text-xl font-semibold text-gray">Classes ({classesWithDegrees.length})</h2>
								</div>
								<AddClassToExam idExam={idExam} existingClassIds={classes.map((c) => c.idClass)} />
							</div>

							<div className="bg-gray-200 rounded-lg p-4">
								{classesWithDegrees.length === 0 ? (
									<div className="text-center py-8">
										<DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
										<p className="text-gray-600">Aucune classe assignée à cet examen</p>
									</div>
								) : (
									<div className="space-y-2">
										{classesWithDegrees.map((classe) => (
											<ClassComp key={classe.idClass} classe={classe} idExam={idExam} />
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
