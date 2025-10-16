import { Exam } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllExamsForOneTeacher = async (idTeacher: number) => {
	return (await fetchApi(`/api/teachers/${idTeacher}/exams`)) as ApiError | SuccessResponse<Exam[]>;
};
