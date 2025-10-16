import { Answer } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const createAnswer = async (
	idExam: number,
	idQuestion: number,
	body: {
		idAnswer: number;
		answer: string;
		isCorrect: boolean;
	}
) => {
	return (await fetchApi(`/api/exams/${idExam}/questions/${idQuestion}/answers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Answer>;
};
