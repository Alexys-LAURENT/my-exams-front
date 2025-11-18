import { Answer } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllAnswersForOneQuestionOfOneExam = async (idExam: number, idQuestion: number) => {
	return (await fetchApi(`/api/exams/${idExam}/questions/${idQuestion}/answers`)) as ApiError | SuccessResponse<Answer[]>;
};
