import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllClassesForOneExam = async (idExam: number) => {
	let url = `/api/classes/exams/${idExam}`;
	return (await fetchApi(url)) as ApiError | SuccessResponse<Class[]>;
};
