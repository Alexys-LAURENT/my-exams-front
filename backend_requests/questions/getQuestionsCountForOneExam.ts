import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getQuestionsCountForOneExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/questions/count`)) as ApiError | SuccessResponse<number>;
};
