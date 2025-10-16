import { Question } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getQuestionsByIdForOneExam = async (idExam: number, idQuestion: number) => {
	return (await fetchApi(`/api/exams/${idExam}/questions/${idQuestion}`)) as ApiError | SuccessResponse<Question>;
};
