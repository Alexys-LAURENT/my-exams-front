import { getAllAnswersForOneQuestionOfOneExam } from '@/backend_requests/answers/getAllAnswersForOneQuestionOfOneExam';
import { getAllClassesForOneExam } from '@/backend_requests/classes/getClassesForOneExam';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getOneExam } from '@/backend_requests/exams/getOneExam';
import { getAllQuestionsForOneExam } from '@/backend_requests/questions/getAllQuestionsForOneExam';
import AddClassToExam from '@/components/TeacherExamByIdPage/AddClassToExam';
import ClassComp from '@/components/TeacherExamByIdPage/ClassComp';
import TimerIcon from '@/components/svg/TimerIcon';
import { auth } from '@/utils/auth';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { formatExamTime } from '@/utils/formatExamTime';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ idExam: string }> }) => {
	const idExam = (await params).idExam;
	const idExamNumber = parseInt(idExam);

	// Récupérer la session du professeur
	const session = await auth();
	if (!session || session.user.accountType !== 'teacher') {
		redirect('/login');
	}

	const [examResponse, questionsResponse, classesResponse] = await Promise.all([getOneExam(idExamNumber), getAllQuestionsForOneExam(idExamNumber), getAllClassesForOneExam(idExamNumber)]);

	if (!('success' in examResponse) || !('success' in questionsResponse) || !('success' in classesResponse)) {
		throw new Error("Erreur lors du chargement de l'examen");
	}

	const exam = examResponse.data;
	const questions = questionsResponse.data;
	const classes = classesResponse.data;

	// Récupérer les réponses pour chaque question
	const questionsWithAnswers = await Promise.all(
		questions.map(async (question) => {
			const answersResponse = await getAllAnswersForOneQuestionOfOneExam(idExamNumber, question.idQuestion);
			if (!('success' in answersResponse)) {
				throw new Error('Erreur lors de la récupération des réponses');
			}
			return {
				...question,
				answers: answersResponse.data,
			};
		})
	);

	const classesWithDegrees = await Promise.all(
		classes.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);

			if (!('success' in degreeResponse)) {
				throw new Error('Erreur lors de la récupération des degrees');
			}

			const degree = degreeResponse.data;
			return { ...classe, degree };
		})
	);

	return (
		<div className="flex flex-col w-full gap-6 p-4 mx-auto md:p-6">
			{/* Backlink */}
			<Link href="/teacher/exams" className="inline-flex items-center  font-medium">
				← Retour aux examens
			</Link>

			{/* Bloc d'informations de l'examen */}
			<div className="p-6 bg-white border rounded-lg border-black/10">
				<div className="flex flex-col items-start justify-between gap-2 mb-4 md:gap-0 md:flex-row">
					<div className="flex flex-row gap-4">
						<div className="hidden w-24 h-24 bg-gray-300 rounded-lg md:block"></div>
						<div>
							<h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
							{exam.desc && <p className="text-gray-600">{exam.desc}</p>}
							<p className="text-sm text-gray-600">Créé le {formatDateWithShortMonth(exam.createdAt)}</p>
						</div>
					</div>
					<div className="flex items-center w-full px-3 py-1 rounded-lg md:w-fit bg-gray-200/50">
						<TimerIcon className="inline w-4 mr-2 md:w-6 aspect-square fill-blue-500" />
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(exam.time * 60)}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
					<div className="p-3 rounded-md bg-blue-50">
						<p className="text-sm text-gray-600">Questions</p>
						<p className="text-lg font-semibold text-blue-700">{questions.length}</p>
					</div>
					<div className="p-3 rounded-md bg-green-50">
						<p className="text-sm text-gray-600">Classes assignées</p>
						<p className="text-lg font-semibold text-green-700">{classes.length}</p>
					</div>
					<div className="p-3 rounded-md bg-purple-50">
						<p className="text-sm text-gray-600">Questions QCM</p>
						<p className="text-lg font-semibold text-purple-700">{questions.filter((q) => q.isQcm).length}</p>
					</div>
					<div className="p-3 rounded-md bg-orange-50">
						<p className="text-sm text-gray-600">Questions ouvertes</p>
						<p className="text-lg font-semibold text-orange-700">{questions.filter((q) => !q.isQcm).length}</p>
					</div>
				</div>
			</div>

			{/* Classes assignées */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900">Classes assignées ({classesWithDegrees.length})</h2>
					<AddClassToExam idExam={idExamNumber} existingClassIds={classes.map((c) => c.idClass)} idTeacher={session.user.idUser} />
				</div>
				<div className="overflow-hidden rounded-md">
					{classesWithDegrees.length === 0 ? (
						<div className="text-center py-12">
							<DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
							<p className="text-gray-500">Aucune classe assignée à cet examen</p>
						</div>
					) : (
						<div className="">
							{classesWithDegrees.map((classe) => (
								<ClassComp key={classe.idClass} classe={classe} idExam={idExamNumber} />
							))}
						</div>
					)}
				</div>
			</div>

			{/* Questions et réponses */}
			<div className="flex flex-col gap-4">
				<h2 className="text-2xl font-bold text-gray-800">Questions de l&apos;examen</h2>
				{questionsWithAnswers.length === 0 ? (
					<div className="p-6 bg-white border rounded-lg border-black/10 text-center">
						<p className="text-gray-500">Aucune question pour cet examen</p>
					</div>
				) : (
					questionsWithAnswers.map((question, index) => (
						<div key={question.idQuestion} className="p-6 bg-white border rounded-lg border-black/10">
							{/* En-tête de la question */}
							<div className="flex flex-col items-start justify-between gap-2 mb-4 md:gap-0 md:flex-row">
								<h3 className="text-xl font-semibold text-gray-800">Question {index + 1}</h3>
								<div className="flex items-center gap-2">
									<span className="px-3 py-1 text-sm bg-gray-100 rounded-full">{question.maxPoints} pts</span>
									{question.isQcm && <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">QCM</span>}
									{question.isMultiple && <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">Multiple</span>}
								</div>
							</div>

							{/* Titre de la question */}
							<p className="text-lg text-gray-700 mb-2">{question.title}</p>
							{question.commentary && <p className="mb-4 text-sm text-gray-700 opacity-70">{question.commentary}</p>}

							{/* Réponses */}
							{question.isQcm ? (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600 mb-2">Réponses possibles :</p>
									{question.answers.map((answer) => (
										<div key={answer.idAnswer} className={`p-3 rounded-md border-2 ${answer.isCorrect ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'}`}>
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													{answer.isCorrect && <span className="text-sm font-bold text-green-700">✓</span>}
													<span className={answer.isCorrect ? 'font-medium text-green-800' : 'text-gray-800'}>{answer.answer}</span>
												</div>
												{answer.isCorrect && <span className="px-2 py-1 text-xs text-green-800 bg-green-200 rounded-full">Bonne réponse</span>}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="p-3 border border-blue-200 rounded-md bg-blue-50">
									<p className="text-sm text-blue-700 font-medium">Question ouverte - L&apos;étudiant doit fournir une réponse libre</p>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Page;
