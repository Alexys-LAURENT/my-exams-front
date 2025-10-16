import { Exam } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getOneExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}`)) as ApiError | SuccessResponse<Exam>;
};
