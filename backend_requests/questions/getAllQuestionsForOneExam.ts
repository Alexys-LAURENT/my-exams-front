import { Question } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllQuestionsForOneExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/questions`)) as ApiError | SuccessResponse<Question[]>;
};
