import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllClassesForOneExam = async (idExam: number, limit?: number) => {
	let url = `/api/classes/exams/${idExam}`;
	if (limit) {
		url += `?limit=${limit}`;
	}
	return (await fetchApi(url)) as ApiError | SuccessResponse<Class[]>;
};
