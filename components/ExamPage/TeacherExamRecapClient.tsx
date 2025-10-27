'use client';

import { createEvaluation } from '@/backend_requests/evaluations/createEvaluation';
import { updateEvaluation } from '@/backend_requests/evaluations/updateEvaluation';
import { updateExamGrade } from '@/backend_requests/exam_grades/updateExamGrade';
import { ExamRecap, QuestionWithDetails } from '@/types/entitties';
import { formatExamTime } from '@/utils/formatExamTime';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import TimerIcon from '../svg/TimerIcon';

type LocalEvaluation = {
	idQuestion: number;
	idUserResponse: number;
	idEvaluation: number | null;
	maxPoints: number;
	note: number | null;
	commentary: string;
};

interface TeacherExamRecapClientProps {
	examData: ExamRecap & { isExamTimeFinished: true };
	student: { name: string; lastName: string };
}

const TeacherExamRecapClient = ({ examData, student }: TeacherExamRecapClientProps) => {
	const router = useRouter();

	const isCorrected = examData.examGrade.status === 'corrigé';

	const submissionDate = useMemo(() => {
		const last = (examData.questions as QuestionWithDetails[])[(examData.questions as QuestionWithDetails[]).length - 1];
		return new Date(last.userResponse.createdAt);
	}, [examData.questions]);
	const questions = examData.questions as QuestionWithDetails[];
	const totalQuestions = (examData.questions as QuestionWithDetails[]).length;

	const qcmQuestions = questions.filter((q) => q.isQcm);
	const totalNoteQcmQuestions = qcmQuestions.reduce((acc, cur) => {
		acc += cur.evaluation && cur.evaluation.note !== null ? parseFloat(cur.evaluation.note as unknown as string) : 0;
		return acc;
	}, 0);
	const nonQcmQuestions = questions.filter((q) => !q.isQcm);
	const [evaluations, setEvaluations] = useState<LocalEvaluation[]>(() =>
		nonQcmQuestions.map((q) => ({
			idQuestion: q.idQuestion,
			idUserResponse: q.userResponse.idUserResponse,
			idEvaluation: q.evaluation ? q.evaluation.idEvaluation : null,
			maxPoints: q.maxPoints,
			note: q.evaluation && q.evaluation.note !== null ? (typeof q.evaluation.note === 'number' ? q.evaluation.note : parseFloat(q.evaluation.note as unknown as string)) : null,
			commentary: (q.evaluation as unknown as { commentary?: string | null })?.commentary ?? '',
		}))
	);

	const allCorrected = evaluations.every((e) => e.idEvaluation !== null && e.note !== null);
	const totalNote = useMemo(() => {
		return totalNoteQcmQuestions + evaluations.filter((e) => e.idEvaluation !== null && e.note !== null).reduce((acc, cur) => acc + (cur.note ?? 0), 0);
	}, [totalNoteQcmQuestions, evaluations]);

	const updateEvalField = (idQuestion: number, field: 'note' | 'commentary', value: number | string) => {
		setEvaluations((prev) =>
			prev.map((e) => {
				if (e.idQuestion !== idQuestion) return e;
				if (field === 'note') {
					let n = typeof value === 'number' ? value : parseFloat(value as string);
					if (Number.isNaN(n)) n = 0;
					// clamp 0..maxPoints
					n = Math.max(0, Math.min(e.maxPoints, n));
					return { ...e, note: n };
				}
				return { ...e, commentary: String(value) };
			})
		);
	};

	const saveEvaluation = async (e: LocalEvaluation) => {
		if (e.note === null) return; // safety
		if (e.note > e.maxPoints) return; // guard
		if (e.idEvaluation === null) {
			const res = await createEvaluation({ idUserResponse: e.idUserResponse, note: e.note, commentary: e.commentary || undefined });
			if ('error' in res) {
				//TODO : Minimal error handling; could be improved with UI toast
				console.error('createEvaluation error', res.error);
				return;
			}
			setEvaluations((prev) => prev.map((x) => (x.idUserResponse === e.idUserResponse ? { ...x, idEvaluation: res.data.idEvaluation } : x)));
		} else {
			const res = await updateEvaluation(e.idEvaluation, { note: e.note, commentary: e.commentary || undefined });
			if ('error' in res) {
				console.error('updateEvaluation error', res.error);
				//TODO : Minimal error handling; could be improved with UI toast
				return;
			}
		}
	};

	const sendFinalGrade = async () => {
		const res = await updateExamGrade(examData.examGrade.idExamGrade, { note: totalNote, status: 'corrigé' });
		if ('error' in res) {
			console.error('updateExamGrade error', res.error);
			return;
		}
		router.refresh();
	};

	return (
		<div className="flex flex-col w-full gap-6 p-4 !pb-24 mx-auto md:p-6">
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
						<p className="text-sm text-gray-600">Étudiant</p>
						<p className="text-lg font-semibold text-blue-700">{student.name + ' ' + student.lastName}</p>
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
				{questions.map((question, index) => {
					const evalForQ = evaluations.find((x) => x.idQuestion === question.idQuestion);
					const needsCorrection = !isCorrected && !question.isQcm && (!!evalForQ ? evalForQ.idEvaluation === null || evalForQ.note === null : true);
					return (
						<div key={question.idQuestion} className={`p-6 bg-white border rounded-lg ${needsCorrection ? 'border-red-500' : 'border-black/10'}`}>
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
							{question.commentary && <p className="mb-4 text-sm text-gray-700 opacity-70">{question.commentary}</p>}

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
																{isCorrect ? "Réponse de l'étudiant ✓" : "Réponse de l'étudiant ✗"}
															</span>
														)}
														{!isSelected && isCorrect && hasUserResponse && (
															<span className="px-2 py-1 text-xs text-green-800 bg-green-200 rounded-full">Bonne réponse</span>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="mb-4">
									<p className="mb-1 text-sm font-semibold text-gray-700">Réponse de l&apos;étudiant :</p>
									{!question.userResponse?.custom ? (
										<div className="p-3 mb-3 border-2 border-orange-300 rounded-md bg-orange-50">
											<p className="font-medium text-orange-700">⚠️ Aucune réponse fournie</p>
										</div>
									) : (
										<div className="p-4 mb-4 border border-gray-300 rounded-md bg-gray-50">
											<p className="text-gray-800 whitespace-pre-wrap">{question.userResponse.custom}</p>
										</div>
									)}

									{/* Section de notation pour les questions non-QCM */}
									{!isCorrected && (
										<div className="p-4 mt-4 border-2 border-blue-200 rounded-lg bg-blue-50">
											<p className="mb-3 text-sm font-semibold text-blue-900">Notation</p>
											<div className="flex flex-col gap-3">
												{(() => {
													const e = evaluations.find((x) => x.idQuestion === question.idQuestion)!;
													const label = e.idEvaluation === null ? 'Enregistrer la correction' : 'Modifier la correction';
													const disabled = e.note === null || e.note > e.maxPoints || e.note < 0;
													return (
														<>
															<div className="flex items-end gap-3">
																<NumberInput
																	variant="flat"
																	classNames={{ inputWrapper: 'border border-black/10 rounded-md shadow-none' }}
																	size="sm"
																	aria-label={`Note pour la question ${index + 1}`}
																	label={`Note sur ${question.maxPoints}`}
																	minValue={0}
																	maxValue={question.maxPoints}
																	step={0.25}
																	value={e.note ?? undefined}
																	className="max-w-[180px]"
																	onValueChange={(val) => updateEvalField(question.idQuestion, 'note', val)}
																/>
															</div>
															<Textarea
																variant="flat"
																classNames={{ inputWrapper: 'border border-black/10 rounded-md shadow-none' }}
																aria-label={`Commentaire pour la question ${index + 1}`}
																label="Commentaire (optionnel)"
																placeholder="Saisissez un commentaire pour l'étudiant (facultatif)"
																minRows={3}
																value={e.commentary}
																onValueChange={(val) => updateEvalField(question.idQuestion, 'commentary', val)}
															/>
															<div className="flex justify-end">
																<Button color="primary" isDisabled={disabled} onPress={() => saveEvaluation(e)}>
																	{label}
																</Button>
															</div>
														</>
													);
												})()}
											</div>
										</div>
									)}
								</div>
							)}

							{/* Évaluation actuelle */}
							{question.evaluation && (
								<div className="pt-4 mt-4 border-t border-gray-200">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Note enregistrée :</span>
										<span className="text-lg font-semibold text-blue-600">
											{question.evaluation.note !== null ? `${question.evaluation.note}/${question.maxPoints}` : 'Non noté'}
										</span>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Bouton d'envoi de la note globale (bleu, positionné en bas à droite) */}
			{!isCorrected && (
				<div className="fixed z-40 flex items-center self-center gap-3 p-3 bg-white border rounded-md shadow-md md:self-auto border-black/10 bottom-4 md:right-6">
					<div className="px-3 py-2 text-sm font-medium text-gray-800 border rounded-md border-black/10 bg-gray-50">
						Total: <span className="font-semibold">{totalNote.toFixed(2)}</span> / 20
					</div>
					<Button className="rounded-md" color="primary" isDisabled={!allCorrected} onPress={sendFinalGrade}>
						Envoyer la note
					</Button>
				</div>
			)}
		</div>
	);
};

export default TeacherExamRecapClient;
