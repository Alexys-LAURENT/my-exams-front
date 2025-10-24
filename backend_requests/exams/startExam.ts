import { Exam, QuestionWithAnswers } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type StartExamResponse = Exam & {
	questions: QuestionWithAnswers[];
};

export const startExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/start`, {
		method: 'POST',
	})) as ApiError | SuccessResponse<StartExamResponse>;
};
