import { AnswerWithoutCorrect } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAnswersByQuestionsForExam = async (idExam: number, idQuestion: number) => {
	return (await fetchApi(`/api/exams/${idExam}/questions/${idQuestion}/answers`)) as ApiError | SuccessResponse<AnswerWithoutCorrect[]>;
};
