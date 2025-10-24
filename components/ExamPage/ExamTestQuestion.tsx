import { createUsersResponse } from '@/backend_requests/users_responses/createUsersResponse';
import { updateUsersResponse } from '@/backend_requests/users_responses/updateUsersReponse';
import { QuestionWithAnswersAndUserReponse } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Checkbox, CheckboxGroup } from '@heroui/checkbox';
import { Textarea } from '@heroui/input';
import { Radio, RadioGroup } from '@heroui/radio';
import { cn } from '@heroui/theme';
import { useCallback, useEffect, useRef, useState } from 'react';

export type CallbackData = {
	selectedAnswers: number[];
	customAnswer: string;
};

interface ExamTestQuestionProps {
	currentQuestion: QuestionWithAnswersAndUserReponse;
	setQuestions: React.Dispatch<React.SetStateAction<QuestionWithAnswersAndUserReponse[] | null>>;
	idExam: number;
	currentQuestionIndex: number;
	setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
	questionsCount: number;
}

const ExamTestQuestion = ({ currentQuestion, idExam, setQuestions, currentQuestionIndex, setCurrentQuestionIndex, questionsCount }: ExamTestQuestionProps) => {
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
	const [customAnswer, setCustomAnswer] = useState('');
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		console.log('Loading question:', currentQuestion);
		console.log(currentQuestion.userResponse ? currentQuestion.userResponse.selectedAnswers : []);
		console.log(currentQuestion.userResponse ? currentQuestion.userResponse.custom || '' : '');

		setSelectedAnswers(currentQuestion.userResponse ? currentQuestion.userResponse.selectedAnswers : []);
		setCustomAnswer(currentQuestion.userResponse ? currentQuestion.userResponse.custom || '' : '');

		// Nettoyer le timer de debounce lors du changement de question
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [currentQuestion]);

	const handleSubmitUserReponse = useCallback(
		async (data: CallbackData) => {
			// Sauvegarder les anciennes valeurs pour pouvoir les restaurer en cas d'erreur
			const previousSelectedAnswers = currentQuestion.userResponse ? currentQuestion.userResponse.selectedAnswers : [];
			const previousCustomAnswer = currentQuestion.userResponse ? currentQuestion.userResponse.custom || '' : '';

			try {
				const hasAlreadyAnswered = currentQuestion.userResponse !== undefined;
				let targetUserReponseId: number | null = null;

				if (hasAlreadyAnswered) {
					const updatedUserResponse = await updateUsersResponse(currentQuestion.userResponse!.idUserResponse, {
						answers: data.selectedAnswers,
						custom: data.customAnswer,
					});
					if ('error' in updatedUserResponse) {
						throw new Error('Error submitting user response');
					}
					targetUserReponseId = currentQuestion.userResponse!.idUserResponse;
				} else {
					const newUserResponse = await createUsersResponse({
						idExam: idExam,
						idQuestion: currentQuestion.idQuestion,
						answers: data.selectedAnswers,
						custom: data.customAnswer,
					});

					if ('error' in newUserResponse) {
						throw new Error('Error submitting user response');
					}
					targetUserReponseId = newUserResponse.data.userResponse.idUserResponse;
				}

				// Met à jour la question courante avec la nouvelle réponse utilisateur
				setQuestions((prevQuestions) => {
					if (!prevQuestions) return prevQuestions;
					return prevQuestions.map((question) => {
						if (question.idQuestion === currentQuestion.idQuestion) {
							return {
								...question,
								userResponse: {
									idUserResponse: targetUserReponseId!,
									custom: data.customAnswer,
									selectedAnswers: data.selectedAnswers,
								},
							};
						}
						return question;
					});
				});
			} catch (error) {
				console.error('Failed to submit response:', error);
				// Restaurer les anciennes valeurs en cas d'erreur
				setSelectedAnswers(previousSelectedAnswers);
				setCustomAnswer(previousCustomAnswer);
			}
		},
		[currentQuestion, idExam, setQuestions]
	);

	const debouncedSubmitCustomAnswer = useCallback(
		(value: string) => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				handleSubmitUserReponse({ selectedAnswers: [], customAnswer: value });
			}, 600); // Délai de 600ms
		},
		[handleSubmitUserReponse]
	);

	return (
		<div className="flex flex-col items-center flex-1 md:justify-center">
			<h2 className="mb-2 text-2xl font-bold text-center md:mb-4 md:text-start">{currentQuestion.title}</h2>
			<p className="mb-2 md:mb-6">{currentQuestion.commentary}</p>
			<p className="mb-2 text-xs opacity-70 md:mb-6 md:text-sm">
				{currentQuestion.isMultiple ? 'Choisissez une ou plusieurs réponses :' : currentQuestion.isQcm ? 'Choisissez une réponse :' : 'Entrez votre réponse :'}
			</p>
			{currentQuestion.isQcm ? (
				currentQuestion.isMultiple ? (
					<CheckboxGroup
						className="flex flex-row justify-center w-full"
						classNames={{ wrapper: 'flex flex-col md:grid md:grid-cols-2 w-full md:w-fit' }}
						aria-label="Sélectionnez au moins une réponse"
						value={selectedAnswers.map(String)}
						onChange={(values) => {
							const numericValues = values.map((value) => parseInt(value, 10));
							setSelectedAnswers(numericValues);
							handleSubmitUserReponse({ selectedAnswers: numericValues, customAnswer: '' });
						}}
					>
						{currentQuestion.answers.map((answer) => (
							<Checkbox
								key={answer.idAnswer}
								value={answer.idAnswer.toString()}
								classNames={{
									base: cn(
										'inline-flex m-0 bg-content1 items-center justify-between',
										'flex-row-reverse max-w-none w-full md:min-w-[300px] md:max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
										'data-[selected=true]:border-primary data-[hover=true]:border-black/10 border-2'
									),
								}}
							>
								{answer.answer}
							</Checkbox>
						))}
					</CheckboxGroup>
				) : (
					<RadioGroup
						value={selectedAnswers.map(String)[0]}
						onValueChange={(value) => {
							const numericValue = parseInt(value, 10);
							setSelectedAnswers([numericValue]);
							handleSubmitUserReponse({ selectedAnswers: [numericValue], customAnswer: '' });
						}}
						aria-label="Sélectionnez une réponse"
						className="flex flex-row justify-center w-full"
						classNames={{ wrapper: 'flex flex-col md:grid md:grid-cols-2 w-full md:w-fit' }}
					>
						{currentQuestion.answers.map((answer) => (
							<Radio
								value={answer.idAnswer.toString()}
								key={answer.idAnswer}
								classNames={{
									base: cn(
										'inline-flex m-0 bg-content1 items-center justify-between',
										'flex-row-reverse max-w-none w-full md:min-w-[300px] md:max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
										'data-[selected=true]:border-primary data-[hover=true]:border-black/20 border-black/10 border'
									),
								}}
							>
								{answer.answer}
							</Radio>
						))}
					</RadioGroup>
				)
			) : (
				<Textarea
					className="w-full md:max-w-[600px]"
					classNames={{ inputWrapper: '!bg-white rounded-lg border border-black/10 hover:border-black/20 shadow-none' }}
					placeholder="Tapez votre réponse ici..."
					value={customAnswer}
					onChange={(e) => {
						const value = e.target.value;
						setCustomAnswer(value);
						debouncedSubmitCustomAnswer(value);
					}}
				></Textarea>
			)}
			<div className="flex gap-2 mt-6">
				<Button isIconOnly onPress={() => setCurrentQuestionIndex((prev) => prev - 1)} isDisabled={currentQuestionIndex === 0}>
					{'<'}
				</Button>
				<Button isIconOnly onPress={() => setCurrentQuestionIndex((prev) => prev + 1)} isDisabled={currentQuestionIndex === questionsCount - 1}>
					{'>'}
				</Button>
			</div>
			{/* <Button isLoading={isLoading} onPress={handleSubmitQuestion} isDisabled={selectedAnswers.length === 0 && !customAnswer.trim()} className="mt-6">
				{currentQuestion.idQuestion === totalQuestions ? "Terminer l'examen" : 'Question Suivante'}
			</Button> */}
		</div>
	);
};

export default ExamTestQuestion;
