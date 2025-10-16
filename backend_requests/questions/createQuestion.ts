import { Question } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const createQuestion = async (
	idExam: number,
	body: {
		idQuestion: number;
		title: string;
		commentary?: string;
		isMultiple: boolean;
		isQcm: boolean;
		maxPoints: number;
	}
) => {
	return (await fetchApi(`/api/exams/${idExam}/questions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Question>;
};
