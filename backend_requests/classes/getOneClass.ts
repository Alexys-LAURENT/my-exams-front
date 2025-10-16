import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getOneClass = async (idClass: number) => {
	return (await fetchApi(`/api/classes/${idClass}`)) as ApiError | SuccessResponse<Class>;
};
