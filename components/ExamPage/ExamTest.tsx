'use client';
import { startExam } from '@/backend_requests/exams/startExam';
import { socket } from '@/socket';
import { Exam, QuestionWithAnswersAndUserReponse } from '@/types/entitties';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ExamTestInfos from './ExamTestInfos';
import ExamTestQuestion from './ExamTestQuestion';
import ExamTestStart from './ExamTestStart';

interface ExamTestProps {
	exam: Exam;
	idClass: number;
	questionsCount: number;
	idUser: number;
	preLoadedQuestionsWithAnswersAndUserResponse?: QuestionWithAnswersAndUserReponse[];
	forceExamStarted?: boolean;
}

export interface TimerData {
	elapsedInSecondes: number;
	remainingInSecondes: number;
	durationInSecondes: number;
}

type ExamFinishedSocketData = { error: true; message: string } | { success: true; message: string };

const ExamTest = ({ exam, idClass, questionsCount, idUser, forceExamStarted, preLoadedQuestionsWithAnswersAndUserResponse }: ExamTestProps) => {
	const [isExamStarted, setIsExamStarted] = useState(forceExamStarted !== undefined ? forceExamStarted : preLoadedQuestionsWithAnswersAndUserResponse !== undefined);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [questions, setQuestions] = useState<QuestionWithAnswersAndUserReponse[] | null>(preLoadedQuestionsWithAnswersAndUserResponse || null);
	const [isLoading, setIsLoading] = useState(false);
	const [timer, setTimer] = useState<TimerData | null>(null);
	const router = useRouter();
	// const examFinishedNormallyRef = useRef(false);
	// const isTerminatingRef = useRef(false);

	useEffect(() => {
		if (!isExamStarted) return;

		socket.emit('start_exam', { idExam: exam.idExam, idUser: idUser, idClass: idClass });

		socket.on('exam:tick', (data: TimerData) => {
			setTimer(data);
		});

		socket.on('exam:finished', (data: ExamFinishedSocketData) => {
			if ('error' in data) {
				router.push('/');
			} else {
				router.refresh();
			}
		});

		// Cleanup
		return () => {
			socket.emit('stop_exam', { idExam: exam.idExam, idUser: idUser, idClass: idClass });
			socket.off('exam:tick');
			socket.off('exam:finished');
		};
	}, [exam.idExam, idUser, idClass, isExamStarted, router]);

	useEffect(() => {
		if (!isExamStarted) return;

		// const terminateExam = async () => {
		// 	if (isTerminatingRef.current || examFinishedNormallyRef.current) return;

		// 	isTerminatingRef.current = true;
		// 	try {
		// 		await stopExam(exam.idExam);
		// 		router.refresh();
		// 	} catch (error) {
		// 		console.error('Error stopping exam:', error);
		// 	}
		// };

		// const handleVisibilityChange = async () => {
		// 	if (document.hidden && !examFinishedNormallyRef.current && !isTerminatingRef.current) {
		// 		await terminateExam();
		// 	}
		// };

		// const handleWindowBlur = async () => {
		// 	if (!examFinishedNormallyRef.current && !isTerminatingRef.current) {
		// 		await terminateExam();
		// 	}
		// };

		// document.addEventListener('visibilitychange', handleVisibilityChange);
		// window.addEventListener('blur', handleWindowBlur);

		// Cleanup: appelé quand le composant est démonté
		return () => {
			// document.removeEventListener('visibilitychange', handleVisibilityChange);
			// window.removeEventListener('blur', handleWindowBlur);
		};
	}, [isExamStarted, exam.idExam, router]);

	const handleStartExam = async () => {
		try {
			setIsLoading(true);
			const resStart = await startExam(idUser, idClass, exam.idExam);
			if ('error' in resStart) {
				throw new Error('Error starting exam');
			}
			setQuestions(resStart.data.questions);

			setCurrentQuestionIndex(0);
			setIsExamStarted(true);
		} catch (error) {
			console.error('Failed to start exam:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col flex-1 gap-4 p-4">
			<ExamTestInfos
				exam={exam}
				idStudent={idUser}
				idClass={idClass}
				questionsCount={questionsCount}
				currentQuestionIndex={currentQuestionIndex}
				setCurrentQuestionIndex={setCurrentQuestionIndex}
				questions={questions}
				timer={timer}
			/>
			{isExamStarted ? (
				<ExamTestQuestion
					currentQuestion={questions![currentQuestionIndex]}
					idExam={exam.idExam}
					idClass={idClass}
					setQuestions={setQuestions}
					currentQuestionIndex={currentQuestionIndex}
					setCurrentQuestionIndex={setCurrentQuestionIndex}
					questionsCount={questionsCount}
				/>
			) : (
				<ExamTestStart isLoading={isLoading} exam={exam} handleStartExam={handleStartExam} />
			)}
		</div>
	);
};

export default ExamTest;
