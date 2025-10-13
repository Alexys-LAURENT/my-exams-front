import { Degree } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getClassDegree = async (idClass: number) => {
	return (await fetchApi(`/api/classes/${idClass}/degrees`)) as ApiError | SuccessResponse<Degree>;
};
