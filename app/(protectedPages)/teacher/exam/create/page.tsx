'use client';
import { createAnswer } from '@/backend_requests/answers/createAnswers';
import { createExam } from '@/backend_requests/exams/createExam';
import { getTeacherMatieres } from '@/backend_requests/matieres/getTeacherMatieres';
import { createQuestion } from '@/backend_requests/questions/createQuestion';
import { ArrowLeftIcon, CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type QuestionData = {
	id: number;
	title: string;
	commentary: string;
	isMultiple: boolean;
	isQcm: boolean;
	maxPoints: number;
	answers: {
		id: number;
		text: string;
		isCorrect: boolean;
	}[];
};

const Page = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const [examTitle, setExamTitle] = useState('');
	const [examDescription, setExamDescription] = useState('');
	const [examDuration, setExamDuration] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [questions, setQuestions] = useState<QuestionData[]>([]);
	const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

	// Matiere integration
	const [matieres, setMatieres] = useState<{ idMatiere: number; nom: string }[]>([]);
	const [selectedMatiere, setSelectedMatiere] = useState<number | null>(null);

	const TOTAL_POINTS = 20;
	const usedPoints = questions.reduce((sum, q) => sum + q.maxPoints, 0);
	const remainingPoints = TOTAL_POINTS - usedPoints;

	// Fetch matieres for teacher
	useEffect(() => {
		async function fetchMatieres() {
			if (session?.user?.idUser) {
				const res = await getTeacherMatieres(session.user.idUser);
				if (res && !('error' in res)) {
					setMatieres(res.data);
				}
			}
		}
		fetchMatieres();
	}, [session?.user?.idUser]);

	const addNewQuestion = () => {
		const newQuestion: QuestionData = {
			id: Date.now(),
			title: '',
			commentary: '',
			isMultiple: false,
			isQcm: true,
			maxPoints: 1,
			answers: [
				{ id: 1, text: '', isCorrect: false },
				{ id: 2, text: '', isCorrect: false },
			],
		};
		setQuestions([...questions, newQuestion]);
		setEditingQuestionId(newQuestion.id);
	};

	const updateQuestion = (id: number, updates: Partial<QuestionData>) => {
		setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
	};

	const deleteQuestion = (id: number) => {
		setQuestions(questions.filter((q) => q.id !== id));
		if (editingQuestionId === id) {
			setEditingQuestionId(null);
		}
	};

	const addAnswerToQuestion = (questionId: number) => {
		const question = questions.find((q) => q.id === questionId);
		if (question) {
			const newAnswerId = Math.max(...question.answers.map((a) => a.id), 0) + 1;
			updateQuestion(questionId, {
				answers: [...question.answers, { id: newAnswerId, text: '', isCorrect: false }],
			});
		}
	};

	const removeAnswerFromQuestion = (questionId: number, answerId: number) => {
		const question = questions.find((q) => q.id === questionId);
		if (question && question.answers.length > 2) {
			updateQuestion(questionId, {
				answers: question.answers.filter((a) => a.id !== answerId),
			});
		}
	};

	const updateAnswer = (questionId: number, answerId: number, text: string) => {
		const question = questions.find((q) => q.id === questionId);
		if (question) {
			updateQuestion(questionId, {
				answers: question.answers.map((a) => (a.id === answerId ? { ...a, text } : a)),
			});
		}
	};

	const updateAnswerCorrect = (questionId: number, answerId: number, isCorrect: boolean) => {
		const question = questions.find((q) => q.id === questionId);
		if (question) {
			if (!question.isMultiple && isCorrect) {
				updateQuestion(questionId, {
					answers: question.answers.map((a) => ({ ...a, isCorrect: a.id === answerId })),
				});
			} else {
				updateQuestion(questionId, {
					answers: question.answers.map((a) => (a.id === answerId ? { ...a, isCorrect } : a)),
				});
			}
		}
	};

	const validateQuestion = (question: QuestionData): string | null => {
		if (!question.title.trim()) {
			return 'Veuillez entrer un titre pour la question';
		}
		if (question.isQcm && !question.answers.some((a) => a.isCorrect)) {
			return 'Veuillez sélectionner au moins une réponse correcte';
		}
		if (question.isQcm && question.answers.some((a) => !a.text.trim())) {
			return 'Veuillez remplir toutes les réponses';
		}
		if (usedPoints > TOTAL_POINTS) {
			return `Le total des points (${usedPoints}) dépasse le maximum autorisé (${TOTAL_POINTS} points)`;
		}
		return null;
	};

	const finishEditingQuestion = (questionId: number) => {
		const question = questions.find((q) => q.id === questionId);
		if (question) {
			const error = validateQuestion(question);
			if (error) {
				alert(error);
				return;
			}
		}
		setEditingQuestionId(null);
	};

	const handleCreateExam = async () => {
		if (!examTitle.trim()) {
			alert("Veuillez entrer un titre pour l'examen");
			return;
		}
		if (!examDuration || Number(examDuration) <= 0) {
			alert("Veuillez entrer une durée valide pour l'examen");
			return;
		}
		if (!selectedMatiere) {
			alert('Veuillez sélectionner une matière');
			return;
		}
		if (questions.length === 0) {
			alert('Veuillez ajouter au moins une question');
			return;
		}
		if (editingQuestionId !== null) {
			alert("Veuillez terminer l'édition de la question en cours");
			return;
		}
		if (usedPoints !== TOTAL_POINTS) {
			alert(`Le total des points doit être exactement ${TOTAL_POINTS} (actuellement: ${usedPoints})`);
			return;
		}

		for (const question of questions) {
			const error = validateQuestion(question);
			if (error) {
				alert(`Question "${question.title}": ${error}`);
				return;
			}
		}

		setIsLoading(true);

		try {
			if (!session?.user?.idUser) {
				alert('Erreur: Utilisateur non connecté');
				return;
			}

			const examResponse = await createExam({
				title: examTitle,
				desc: examDescription || '',
				time: Number(examDuration),
				idTeacher: session.user.idUser,
				idMatiere: selectedMatiere,
			});

			if ('error' in examResponse) {
				alert("Erreur lors de la création de l'examen");
				return;
			}

			const examId = examResponse.data.idExam;

			for (let i = 0; i < questions.length; i++) {
				const question = questions[i];

				const questionResponse = await createQuestion(examId, {
					idQuestion: i + 1,
					title: question.title,
					commentary: question.commentary || undefined,
					isMultiple: question.isMultiple,
					isQcm: question.isQcm,
					maxPoints: question.maxPoints,
				});

				if ('error' in questionResponse) {
					alert(`Erreur lors de la création de la question "${question.title}"`);
					return;
				}

				const questionId = questionResponse.data.idQuestion;

				if (question.isQcm && question.answers.length > 0) {
					for (let j = 0; j < question.answers.length; j++) {
						const answer = question.answers[j];

						const answerResponse = await createAnswer(examId, questionId, {
							idAnswer: j + 1,
							answer: answer.text,
							isCorrect: answer.isCorrect,
						});

						if ('error' in answerResponse) {
							alert(`Erreur lors de la création de la réponse`);
							return;
						}
					}
				}
			}

			alert('Examen créé avec succès !');
			router.push(`/teacher/exams/${examResponse.data.idExam}`);
		} catch (error) {
			console.error('Erreur:', error);
			alert("Une erreur est survenue lors de la création de l'examen");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col py-6 px-20 gap-8">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="font-semibold text-xl">Créer un nouvel examen</h1>
					<h2>Configurez les détails de votre examen et ajouter vos questions</h2>
				</div>
				<div className="bg-white border border-black/10 rounded-xl py-6 gap-8 flex flex-col mx-10">
					<div className="px-12 flex gap-8 items-center">
						<Input
							variant="bordered"
							label="Titre de l'examen"
							placeholder="Ex : Mathématique - Chapitre 5"
							labelPlacement="outside-top"
							className="w-1/3"
							value={examTitle}
							onValueChange={setExamTitle}
							isRequired
							errorMessage={() => null}
						/>
						<Input
							variant="bordered"
							label="Durée (minutes)"
							placeholder="Durée"
							labelPlacement="outside-top"
							className="w-1/3"
							type="number"
							step={1}
							min={1}
							value={examDuration}
							onValueChange={setExamDuration}
							isRequired
							errorMessage={() => null}
						/>
						<Select
							variant="bordered"
							label="Matière"
							labelPlacement="outside"
							className="w-1/3"
							selectedKeys={selectedMatiere ? new Set([selectedMatiere.toString()]) : new Set()}
							onSelectionChange={(keys) => {
								const key = Array.from(keys)[0];
								setSelectedMatiere(Number(key));
							}}
							placeholder="Sélectionner une matière"
							disallowEmptySelection
						>
							{matieres.map((matiere) => (
								<SelectItem key={matiere.idMatiere} id={matiere.idMatiere.toString()}>
									{matiere.nom}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="px-12 flex items-center">
						<Textarea
							minRows={4}
							variant="bordered"
							label="Description de l'examen"
							placeholder="Description de l'examen, consignes particulières..."
							labelPlacement="outside-top"
							value={examDescription}
							onValueChange={setExamDescription}
						/>
					</div>
					<div className="px-6 flex gap-4 items-center">
						<span className="text-sm text-gray-500">{questions.length} question(s) ajoutée(s)</span>
						<span className="text-sm font-medium">•</span>
						<span className={`text-sm font-medium ${remainingPoints < 0 ? 'text-danger' : remainingPoints === 0 ? 'text-success' : 'text-primary'}`}>
							{remainingPoints} point(s) restant(s) sur {TOTAL_POINTS}
						</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<h1 className="font-semibold text-xl">Questions de l&apos;examen</h1>
					{questions.length > 0 && (
						<div className="flex gap-3 items-center">
							<span className="text-sm text-gray-500">{questions.length} question(s)</span>
							<span className="text-sm font-medium">•</span>
							<span className={`text-sm font-medium ${remainingPoints < 0 ? 'text-danger' : remainingPoints === 0 ? 'text-success' : 'text-primary'}`}>
								{usedPoints}/{TOTAL_POINTS} points assignés
							</span>
						</div>
					)}
				</div>

				{questions.length > 0 && (
					<div className="flex flex-col gap-4 mx-10">
						{questions.map((question, index) => {
							const isEditing = editingQuestionId === question.id;

							return (
								<div key={question.id} className={`bg-white border border-black/10 rounded-xl py-6 px-8 flex flex-col gap-4 ${isEditing ? 'border-2 border-primary' : ''}`}>
									<div className="flex justify-between items-start">
										<span className="font-semibold text-lg">Question {index + 1}</span>
										<div className="flex gap-2">
											{isEditing ? (
												<Button size="sm" variant="solid" color="success" isIconOnly onPress={() => finishEditingQuestion(question.id)}>
													<CheckIcon className="w-4 h-4" />
												</Button>
											) : (
												<Button size="sm" variant="light" color="primary" onPress={() => setEditingQuestionId(question.id)}>
													Modifier
												</Button>
											)}
											<Button size="sm" variant="light" color="danger" isIconOnly onPress={() => deleteQuestion(question.id)}>
												<TrashIcon className="w-4 h-4" />
											</Button>
										</div>
									</div>

									{isEditing ? (
										<div className="flex flex-col gap-4">
											<Input
												variant="bordered"
												label="Titre de la question"
												placeholder="Ex : Quelle est la capitale de la France ?"
												value={question.title}
												onValueChange={(val) => updateQuestion(question.id, { title: val })}
												labelPlacement="outside"
											/>

											<Textarea
												variant="bordered"
												label="Commentaire (optionnel)"
												placeholder="Ajoutez un commentaire ou une explication..."
												value={question.commentary}
												onValueChange={(val) => updateQuestion(question.id, { commentary: val })}
												labelPlacement="outside"
												minRows={2}
											/>

											<div className="flex gap-4 items-center">
												<div className="flex flex-col gap-1 w-1/3">
													<Input
														variant="bordered"
														label="Points"
														type="number"
														min={1}
														step={1}
														value={question.maxPoints.toString()}
														onValueChange={(val) => updateQuestion(question.id, { maxPoints: Number(val) })}
														labelPlacement="outside"
													/>
													<span className={`text-xs ${remainingPoints < 0 ? 'text-danger' : 'text-gray-500'}`}>
														{remainingPoints + question.maxPoints} point(s) disponible(s)
													</span>
												</div>

												<Switch
													isSelected={question.isQcm}
													onValueChange={(val) => updateQuestion(question.id, { isQcm: val, answers: val ? question.answers : [] })}
													className="pt-1"
												>
													Question à choix multiple (QCM)
												</Switch>
											</div>

											{question.isQcm && (
												<>
													<Switch isSelected={question.isMultiple} onValueChange={(val) => updateQuestion(question.id, { isMultiple: val })}>
														Autoriser plusieurs réponses correctes
													</Switch>

													<div className="flex flex-col gap-3">
														<div className="flex justify-between items-center">
															<label className="font-medium">Réponses possibles</label>
															<Button
																size="sm"
																variant="flat"
																color="primary"
																startContent={<PlusIcon className="w-4 h-4" />}
																onPress={() => addAnswerToQuestion(question.id)}
															>
																Ajouter une réponse
															</Button>
														</div>

														{question.answers.map((answer, answerIndex) => (
															<div key={answer.id} className="flex gap-2 items-center">
																<Checkbox isSelected={answer.isCorrect} onValueChange={(checked) => updateAnswerCorrect(question.id, answer.id, checked)}>
																	Correcte
																</Checkbox>
																<Input
																	variant="bordered"
																	placeholder={`Réponse ${answerIndex + 1}`}
																	value={answer.text}
																	onValueChange={(val) => updateAnswer(question.id, answer.id, val)}
																	className="flex-1"
																/>
																{question.answers.length > 2 && (
																	<Button
																		size="sm"
																		variant="light"
																		color="danger"
																		isIconOnly
																		onPress={() => removeAnswerFromQuestion(question.id, answer.id)}
																		className="mt-1"
																	>
																		<TrashIcon className="w-4 h-4" />
																	</Button>
																)}
															</div>
														))}
													</div>
												</>
											)}
										</div>
									) : (
										<div className="flex flex-col gap-2">
											<p className="font-medium">{question.title || <span className="text-gray-400 italic">Titre non défini</span>}</p>
											{question.commentary && <p className="text-sm text-gray-500 italic">{question.commentary}</p>}
											<div className="flex gap-4 text-sm flex-wrap">
												<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{question.isQcm ? 'QCM' : 'Réponse libre'}</span>
												{question.isQcm && question.isMultiple && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Réponses multiples</span>}
												<span className="bg-green-100 text-green-800 px-2 py-1 rounded">{question.maxPoints} point(s)</span>
											</div>

											{question.isQcm && question.answers.length > 0 && (
												<div className="flex flex-col gap-2 mt-2 pl-4 border-l-2 border-gray-200">
													<p className="text-sm font-medium text-gray-600">Réponses possibles :</p>
													{question.answers.map((answer) => (
														<div key={answer.id} className="flex gap-2 items-center">
															<span className={`text-sm ${answer.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
																{answer.isCorrect ? '✓' : '○'} {answer.text || <span className="text-gray-400 italic">Non remplie</span>}
															</span>
														</div>
													))}
												</div>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}

				{/* Encadré toujours visible pour ajouter une question */}
				<div className="bg-white rounded-xl py-6 flex gap-6 flex-col mx-10 border-2 border-dashed border-gray-300 justify-center items-center">
					<div className="flex flex-col gap-2">
						<p className="text-white w-10 h-10 text-xl bg-gray-300 rounded-full flex text-center items-center justify-center mx-auto font-bold">+</p>
						<p className="text-center text-gray-500">{questions.length === 0 ? 'Aucune question ajoutée' : 'Ajouter une nouvelle question'}</p>
						<p className="text-center text-gray-500">
							{questions.length === 0 ? "Commencez par ajouter votre première question à l'examen." : 'Cliquez sur le bouton ci-dessous pour ajouter une question supplémentaire.'}
						</p>
					</div>
					<Button variant="solid" color="primary" className="w-fit" startContent={<PlusIcon className="w-5 h-5" />} onPress={addNewQuestion}>
						Ajouter une question
					</Button>
				</div>
			</div>

			<div className="w-full justify-between flex">
				<Button variant="light" color="primary" startContent={<ArrowLeftIcon className="w-5 h-5" />} onPress={() => router.push('/teacher/dashboard')}>
					Retour à l&apos;accueil
				</Button>
				<Button
					variant="solid"
					color="success"
					className="text-white"
					onPress={handleCreateExam}
					isLoading={isLoading}
					isDisabled={isLoading || usedPoints !== TOTAL_POINTS || questions.length === 0 || editingQuestionId !== null}
				>
					Publier l&apos;examen
				</Button>
			</div>
		</div>
	);
};

export default Page;
