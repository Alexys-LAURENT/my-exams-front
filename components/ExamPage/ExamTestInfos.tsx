'use client';
import { Exam, ExamClass, QuestionWithAnswersAndUserReponse } from '@/types/entitties';
import { formatExamTime } from '@/utils/formatExamTime';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import TimerIcon from '../svg/TimerIcon';
import ButtonFinishExam from './ButtonFinishExam';
import { TimerData } from './ExamTest';
interface ExamTestInfosProps {
	exam: Exam;
	idStudent: number;
	idClass: number;
	questionsCount: number;
	currentQuestionIndex: number;
	setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
	questions: QuestionWithAnswersAndUserReponse[] | null;
	timer: TimerData | null;
	examClass: ExamClass;
}
const ExamTestInfos = ({ exam, idStudent, idClass, questionsCount, questions, currentQuestionIndex, setCurrentQuestionIndex, timer, examClass }: ExamTestInfosProps) => {
	// Questions are available if the exam has started
	const isExamStarted = questions !== null;
	// Check if all questions have been answered
	const isExamFinished = questions ? questions.every((question) => question.userResponse !== undefined) : false;

	return (
		<div className="flex flex-col gap-2 p-4 bg-white border rounded-lg border-black/10">
			<div className="flex flex-col items-start justify-between gap-2 md:gap-0 md:items-center md:flex-row">
				<div className="flex items-center gap-4">
					{/* TODO : incorporate exam image when available */}
					<div className="hidden w-10 bg-gray-300 rounded-md sm:block md:w-16 aspect-square"></div>
					<div>
						<h1 className="text-base font-bold md:text-xl">{exam.title}</h1>
						<p className="text-sm md:text-md">{exam.desc}</p>
						<p className="text-gray-600 text-sm ">{`Réalisable du ${moment(examClass.start_date).format('DD/MM/YYYY HH:mm')} au ${moment(examClass.end_date).format(
							'DD/MM/YYYY HH:mm'
						)}`}</p>
						<p className="text-sm md:text-md text-gray-600">
							{questionsCount} question{questionsCount > 1 ? 's' : ''}
						</p>
					</div>
				</div>
				<div className="flex items-center w-full px-3 py-1 rounded-lg md:w-fit bg-gray-200/50">
					<TimerIcon className="inline w-4 mr-2 md:w-6 aspect-square fill-blue-500" />
					{timer ? (
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(timer.remainingInSecondes)}</p>
					) : (
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(exam.time * 60)}</p>
					)}
				</div>
			</div>
			{isExamStarted && (
				<>
					<div className="flex flex-col items-end">
						<div className="flex w-full gap-2 flex-nowrap">
							{Array.from({ length: questionsCount }).map((_, index) => (
								<QuestionButton
									key={`question-button-${index}`}
									index={index}
									currentQuestionIndex={currentQuestionIndex}
									setCurrentQuestionIndex={setCurrentQuestionIndex}
									question={questions ? questions[index] : null}
								/>
							))}
						</div>
					</div>

					<Divider />
					<div className="flex justify-end w-full">
						<ButtonFinishExam isExamFinished={isExamFinished} idExam={exam.idExam} idStudent={idStudent} idClass={idClass} />
					</div>
				</>
			)}
		</div>
	);
};

export default ExamTestInfos;

interface QuestionButtonProps {
	index: number;
	currentQuestionIndex: number;
	setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
	question: QuestionWithAnswersAndUserReponse | null;
}

const QuestionButton = ({ index, currentQuestionIndex, setCurrentQuestionIndex, question }: QuestionButtonProps) => {
	const isAnswered = question ? !!question.userResponse : false;
	return (
		<Button
			size="sm"
			isIconOnly
			onPress={() => setCurrentQuestionIndex(index)}
			key={`button-question-${index}`}
			className={`${index === currentQuestionIndex ? 'border-2 border-dotted border-blue-500' : ''} ${isAnswered ? 'bg-blue-500/50' : 'bg-gray-300'}`}
		>
			<p className="text-sm font-semibold text-center text-white">{index + 1}</p>
		</Button>
	);
};
