import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllClassesForOneTeacher = async (idTeacher: number, limit?: number) => {
	let url = `/api/teachers/${idTeacher}/classes`;
	if (limit) {
		url += `?limit=${limit}`;
	}
	return (await fetchApi(url)) as ApiError | SuccessResponse<Class[]>;
};
