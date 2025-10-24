import { getExamRecap } from '@/backend_requests/exams/getExamRecap';
import { getOneTeacher } from '@/backend_requests/teachers/getOneTeacher';
import { formatExamTime } from '@/utils/formatExamTime';
import moment from 'moment';
import TimerIcon from '../svg/TimerIcon';
interface ExamRecapPageProps {
	idStudent: number;
	idExam: number;
	isEditable: boolean;
}

const ExamRecapPage = async ({ idStudent, idExam, isEditable }: ExamRecapPageProps) => {
	const recapRes = await getExamRecap(idStudent, idExam);
	console.log(isEditable);

	if ('error' in recapRes) {
		throw new Error('Error fetching exam recap data');
	}

	const examData = recapRes.data;
	const teacher = await getOneTeacher(examData.idTeacher);

	if ('error' in teacher) {
		throw new Error('Error fetching teacher data');
	}

	const submissionDate = new Date(examData.questions[examData.questions.length - 1].userResponse.createdAt);
	const totalQuestions = examData.questions.length;

	return (
		<div className="flex flex-col w-full gap-6 p-4 mx-auto md:p-6">
			{/* Bloc d'informations de l'examen */}
			<div className="p-6 bg-white border rounded-lg border-black/10">
				<div className="flex flex-col items-start justify-between gap-2 mb-4 :gap-0 md:flex-row ">
					<div className="flex flex-row gap-4 ">
						{/* TODO: Implement exam image */}
						{/* {examData.imagePath && <Image src={examData.imagePath} alt={examData.title} className="object-cover w-24 h-24 rounded-lg" />} */}
						<div className="hidden w-24 h-24 bg-gray-300 rounded-lg md:block"></div>
						<div className="">
							<h1 className="text-3xl font-bold text-gray-800">{examData.title}</h1>
							{examData.desc && <p className="text-gray-600 ">{examData.desc}</p>}
							<p className="text-sm text-gray-600">
								{totalQuestions} question{totalQuestions > 1 ? 's' : ''}
							</p>
						</div>
					</div>
					<div className="flex items-center w-full px-3 py-1 rounded-lg md:w-fit bg-gray-200/50">
						<TimerIcon className="inline w-4 mr-2 md:w-6 aspect-square fill-blue-500" />
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(examData.time * 60)}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
					<div className="p-3 rounded-md bg-blue-50">
						<p className="text-sm text-gray-600">Professeur</p>
						<p className="text-lg font-semibold text-blue-700">{teacher.data.name + ' ' + teacher.data.lastName}</p>
					</div>
					<div className="p-3 rounded-md bg-green-50">
						<p className="text-sm text-gray-600">Rendu le</p>
						<p className="text-lg font-semibold text-green-700">
							{moment(submissionDate).format('MM/DD/YYYY')} à {moment(submissionDate).format('HH:mm')}
						</p>
					</div>
					<div className="p-3 rounded-md bg-orange-50">
						<p className="text-sm text-gray-600">Note</p>
						<p className="text-lg font-semibold text-orange-700">{examData.examGrade.note !== null ? `${examData.examGrade.note}/20` : 'Non noté'}</p>
					</div>
					<div className="p-3 rounded-md bg-violet-50">
						<p className="text-sm text-gray-600">Statut</p>
						<p className="text-lg font-semibold text-violet-700">{examData.examGrade.status.charAt(0).toUpperCase() + examData.examGrade.status.slice(1)}</p>
					</div>
				</div>
			</div>

			{/* Liste des questions */}
			<div className="flex flex-col gap-4">
				{examData.questions.map((question, index) => (
					<div key={question.idQuestion} className="p-6 bg-white border rounded-lg border-black/10 ">
						{/* En-tête de la question */}
						<div className="flex flex-col items-start justify-between gap-2 mb-4 md:gap-0 md:flex-row">
							<h2 className="text-xl font-semibold text-gray-800">Question {index + 1}</h2>
							<div className="flex items-center gap-2">
								<span className="px-3 py-1 text-sm bg-gray-100 rounded-full">{question.maxPoints} pts</span>
								{question.isQcm && <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">QCM</span>}
								{question.isMultiple && <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">Multiple</span>}
							</div>
						</div>

						{/* Titre de la question */}
						<p className="text-lg text-gray-700 ">{question.title}</p>
						<p className="mb-4 text-sm text-gray-700 opacity-70">{question.commentary}</p>

						{/* Réponses */}
						{question.isQcm ? (
							<div className="mb-4 space-y-2">
								{/* Indicateur si l'utilisateur n'a pas répondu */}
								{(!question.userResponse?.selectedAnswers || question.userResponse.selectedAnswers.length === 0) && (
									<div className="p-3 mb-3 border-2 border-orange-300 rounded-md bg-orange-50">
										<p className="font-medium text-orange-700">⚠️ Aucune réponse sélectionnée</p>
									</div>
								)}
								{question.answers.map((answer) => {
									const isSelected = question.userResponse?.selectedAnswers.some((selected) => selected.id_answer === answer.idAnswer);
									const isCorrect = answer.isCorrect;
									const hasUserResponse = question.userResponse?.selectedAnswers && question.userResponse.selectedAnswers.length > 0;

									return (
										<div
											key={answer.idAnswer}
											className={`p-3 rounded-md border-2 ${
												isSelected && isCorrect
													? 'bg-green-50 border-green-500'
													: isSelected && !isCorrect
													? 'bg-red-50 border-red-500'
													: isCorrect
													? hasUserResponse
														? 'bg-green-50 border-green-300 border-dashed'
														: 'bg-green-50 border-green-500'
													: 'bg-gray-50 border-gray-200'
											}`}
										>
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													{isSelected && <span className={`text-sm font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? '✓' : '✗'}</span>}
													{!isSelected && isCorrect && <span className="text-sm font-bold text-green-700">✓</span>}
													<span className={isCorrect ? 'font-medium text-green-800' : isSelected ? 'text-red-800' : ''}>{answer.answer}</span>
												</div>
												{/* Légende à droite */}
												<div className="flex items-center gap-2">
													{isSelected && (
														<span className={`text-xs px-2 py-1 rounded-full ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
															{isCorrect ? 'Votre réponse ✓' : 'Votre réponse ✗'}
														</span>
													)}
													{!isSelected && isCorrect && hasUserResponse && <span className="px-2 py-1 text-xs text-green-800 bg-green-200 rounded-full">Bonne réponse</span>}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="mb-4">
								<p className="mb-1 text-sm text-gray-600">Réponse de l&apos;étudiant :</p>
								{!question.userResponse?.custom && (
									<div className="p-3 mb-3 border-2 border-orange-300 rounded-md bg-orange-50">
										<p className="font-medium text-orange-700">⚠️ Aucune réponse fournie</p>
									</div>
								)}
								<div className="p-3 border border-blue-200 rounded-md bg-blue-50">
									<p className="text-gray-800">{question.userResponse.custom}</p>
								</div>
							</div>
						)}

						{/* Réponse personnalisée */}
						{/* {question.userResponse?.custom && (
							
						)} */}

						{/* Évaluation */}
						{question.evaluation && (
							<div className="pt-4 mt-4 border-t border-gray-200">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Note obtenue :</span>
									<span className="text-lg font-semibold text-blue-600">{question.evaluation.note !== null ? `${question.evaluation.note}/${question.maxPoints}` : 'Non noté'}</span>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ExamRecapPage;
