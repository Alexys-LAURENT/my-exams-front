import { Exam, QuestionWithAnswers } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type ExamWithDetails = Exam & {
	questions: (QuestionWithAnswers & { answers: { idAnswer: number; answer: string; isCorrect: boolean }[] })[];
};

export const getExamWithQuestionsAndAnswers = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/full`)) as ApiError | SuccessResponse<ExamWithDetails>;
};
